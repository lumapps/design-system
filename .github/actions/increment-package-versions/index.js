const lodash = require('lodash');
const semver = require('semver');
const util = require('util');
const child_process = require('child_process');
const run = (cmd) => util.promisify(child_process.exec)(cmd, { cwd: process.env.GITHUB_WORKSPACE });

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

    const releaseType = inputs.releaseType || 'prepatch';
    const isPrerelease = releaseType.startsWith('pre');
    console.log(`Release type: ${releaseType}`);
    const prereleaseName = lodash.kebabCase(inputs.prereleaseName || 'alpha');

    const getVersion = (tag) => run(`npm view @lumx/core@${tag} version`).then(({ stdout }) => stdout.trim());
    const npmLatestVersion = await getVersion('latest');
    // Use local version if higher than NPM (handles NPM propagation delay after a release)
    const localCoreVersion = require(`${process.env.GITHUB_WORKSPACE}/packages/lumx-core/package.json`).version;
    const latestVersion = semver.gt(localCoreVersion, npmLatestVersion) ? localCoreVersion : npmLatestVersion;
    if (latestVersion !== npmLatestVersion) {
        console.log(`Using local version ${latestVersion} (NPM latest: ${npmLatestVersion})`);
    }

    if (!isPrerelease && !inputs.releaseBranch) {
        // Exit if not on master (skip when releaseBranch is provided by automation)
        if (baseBranch !== 'master') {
            console.log(`New ${releaseType} release can only be created from the master branch.\n`);
            process.exit(1);
        }

        const localVersion = require(`${process.env.GITHUB_WORKSPACE}/package.json`).version;
        if (localVersion !== npmLatestVersion) {
            console.log(
                `NPM latest version (${npmLatestVersion}) does not match the local latest version (${localVersion}).\n`,
            );
            process.exit(1);
        }

        // Check that the changelog has unreleased changes.
        try {
            await run('yarn changelog-verify --unreleased');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    } else if (isPrerelease) {
        console.log(`Prerelease name: ${prereleaseName}`);
    }

    const distTag = isPrerelease ? prereleaseName : 'latest';
    console.log(`NPM dist tag: ${distTag}`);

    const prevDistTagVersion = await getVersion(distTag).catch(() => '');

    let nextVersion;
    if (isPrerelease) {
        const baseReleaseType = releaseType.replace('pre', '');
        const expectedBase = semver.inc(latestVersion, baseReleaseType);
        if (prevDistTagVersion && prevDistTagVersion.startsWith(expectedBase)) {
            nextVersion = semver.inc(prevDistTagVersion, 'prerelease', prereleaseName);
        } else {
            nextVersion = semver.inc(latestVersion, releaseType, prereleaseName);
        }
    } else {
        nextVersion = semver.inc(prevDistTagVersion || latestVersion, releaseType);
    }
    console.log(`New ${releaseType} version: ${nextVersion}`);

    const releaseBranch = inputs.releaseBranch || `release/${nextVersion}`;
    await run(`git checkout -B ${releaseBranch}`);

    // Update version in all packages
    await run(`yarn workspaces foreach -A version ${nextVersion}`);

    // Update version in changelog (need to run in a package which has a version, so not the root package)
    await run(`yarn workspace @lumx/core update-version-changelog`);

    return { nextVersion, distTag, releaseBranch, releaseType, prevDistTagVersion };
}

module.exports = main;
