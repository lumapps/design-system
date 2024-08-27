/**
 * Upgrade package versions for release or prerelease.
 *
 * See `action.yml` for details on the params in `inputs`.
 */
async function main({ inputs, github }) {
    const refType = github.ref_type;
    const refName = github.ref_name;

    if (refType !== 'branch') {
        console.log(`Release workflow can only be run from a branch.\n`);
        process.exit(1);
    }

    const run = require('util').promisify(require('child_process').exec);
    const lodash = require('lodash');
    const semver = require('semver');
    const releaseType = inputs.releaseType || 'prerelease';
    console.log(`Release type: ${releaseType}`);
    const prereleaseName = lodash.kebabCase(inputs.prereleaseName || 'alpha');

    const getVersion = (tag) => run(`npm view @lumx/core@${tag} version`).then(({ stdout }) => stdout.trim());
    const npmLatestVersion = await getVersion('latest');

    if (releaseType !== 'prerelease') {
        // Exit if not on master
        if (refName !== 'master') {
            console.log(`New ${releaseType} release can only be created from master.\n`);
            process.exit(1);
        }

        const localVersion = require('./lerna.json').version;
        if (localVersion !== npmLatestVersion) {
            console.log(`NPM latest version (${npmLatestVersion}) does not match the local latest version (${localVersion}).\n`);
            process.exit(1);
        }

        // Check that the changelog has unreleased changes.
        try {
            await run('yarn changelog-verify --unreleased');
        } catch(err) {
            console.log(err);
            process.exit(1);
        }
    } else {
        console.log(`Prerelease name: ${prereleaseName}`);
    }

    // Get NPM dist tag
    const distTag = releaseType === 'prerelease' ? prereleaseName : 'latest';
    console.log(`NPM dist tag: ${distTag}`);

    // Get base version (version from which to increment)
    const distTagBaseVersion = await getVersion(distTag);
    let baseVersion = distTagBaseVersion;
    // Prerelease should start with latest NPM version + patch (ex: 'v1.0.0' => 'v1.0.1-alpha.0')
    if (releaseType === 'prerelease' && (!baseVersion || !baseVersion.startsWith(semver.inc(npmLatestVersion, 'patch')))) {
        baseVersion = npmLatestVersion;
    }
    console.log(`${releaseType} base version: ${baseVersion}`);

    // Increment version
    const nextVersion = semver.inc(baseVersion, releaseType, prereleaseName);
    console.log(`New ${releaseType} version: ${nextVersion}`);

    // Checkout new branch (lerna version requires this)
    const branch = `release/${nextVersion}`;
    await run(`git checkout -b ${branch}`);

    // Update version in all packages
    await run(`yarn lerna version --no-git-tag-version --yes ${nextVersion}`);

    // Update yarn.lock with new package versions
    await run(`YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install`);

    // Update version in changelog (need to run in a package which has a version, so not the root package)
    await run(`yarn workspace @lumx/core update-version-changelog`);

    return { nextVersion, distTag, branch, releaseType, refName, distTagBaseVersion };
}

module.exports = main;
