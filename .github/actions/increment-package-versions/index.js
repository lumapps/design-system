const lodash = require('lodash');
const semver = require('semver');
const util = require('util');
const child_process = require('child_process');
const run = (cmd) => util.promisify(child_process.exec)(cmd, { cdw: process.env.GITHUB_WORKSPACE });

/**
 * Increment package versions for release or prerelease.
 *
 * See `action.yml` for details on the params in `inputs`.
 */
async function main({ inputs, context }) {
    const [_, baseBranch] = context.ref.match(/refs\/heads\/(.*)/) || [];

    if (!baseBranch && !context.ref.startsWith('refs/pull')) {
        console.log(`Release workflow can only be run from a branch or PR.\n`);
        process.exit(1);
    }

    const releaseType = inputs.releaseType || 'prerelease';
    console.log(`Release type: ${releaseType}`);
    const prereleaseName = lodash.kebabCase(inputs.prereleaseName || 'alpha');

    const getVersion = (tag) => run(`npm view @lumx/core@${tag} version`).then(({ stdout }) => stdout.trim());
    const npmLatestVersion = await getVersion('latest');

    if (releaseType !== 'prerelease') {
        // Exit if not on master
        if (baseBranch !== 'master') {
            console.log(`New ${releaseType} release can only be created from master branch.\n`);
            process.exit(1);
        }

        const localVersion = require(`${process.env.GITHUB_WORKSPACE}/package.json`).version;
        if (localVersion !== npmLatestVersion) {
            console.log(`NPM latest version (${npmLatestVersion}) does not match the local latest version (${localVersion}).\n`);
            process.exit(1);
        }

        // Check that the changelog has unreleased changes.
        try {
            await run('yarn changelog-verify --unreleased');
        } catch (err) {
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
    const prevDistTagVersion = await getVersion(distTag);
    let baseVersion = prevDistTagVersion;
    // Prerelease should start with latest NPM version + patch (ex: 'v1.0.0' => 'v1.0.1-alpha.0')
    if (releaseType === 'prerelease' && (!baseVersion || !baseVersion.startsWith(semver.inc(npmLatestVersion, 'patch')))) {
        baseVersion = npmLatestVersion;
    }
    console.log(`${releaseType} base version: ${baseVersion}`);

    // Increment version
    const nextVersion = semver.inc(baseVersion, releaseType, prereleaseName);
    console.log(`New ${releaseType} version: ${nextVersion}`);

    // Checkout new branch
    const releaseBranch = `release/${nextVersion}`;
    await run(`git checkout -b ${releaseBranch}`);

    // Update version in all packages
    await run(`yarn workspaces foreach -A version ${nextVersion}`);

    // Update version in changelog (need to run in a package which has a version, so not the root package)
    await run(`yarn workspace @lumx/core update-version-changelog`);

    return { nextVersion, distTag, releaseBranch, releaseType, prevDistTagVersion };
}

module.exports = main;
