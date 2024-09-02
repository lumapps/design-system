/* eslint-disable */

const fs = require('fs');

const { getStoryBookURL } = require('../utils');
const { CHANGELOG_PATH } = require('../../../configs/path');
const VERSION_HEADER_REGEXP = /^## \[(.*?)\]\[\]/mg;

// Extract changelog from latest version in CHANGELOG.md
async function getLatestVersionChangelog() {
    const changelog = (await fs.promises.readFile(CHANGELOG_PATH)).toString();
    // Get first and second version header
    const [matchLatestVersion, matchVersionBefore] = changelog.matchAll(VERSION_HEADER_REGEXP);
    const version = matchLatestVersion[1];
    // Start changelog after the first version header
    const startLastVersionChangelog = changelog.indexOf('\n', matchLatestVersion.index);
    // Get lines between start and the second version header
    const versionChangelog = changelog.substring(startLastVersionChangelog, matchVersionBefore.index).trim();
    return { version, versionChangelog };
}

/**
 * Generate release note and create a release on GH.
 */
async function main({ github, context }) {
    const storybookURLPromise = getStoryBookURL(context.sha);
    const { version, versionChangelog } = await getLatestVersionChangelog();
    const versionTag = `v${version}`;

    // Related links
    const changelogURL = `https://github.com/lumapps/design-system/blob/${versionTag}/CHANGELOG.md`;
    const storyBookURL = await storybookURLPromise;
    const links = `[🎨 StoryBook](${storyBookURL}) - [📄 See changelog history](${changelogURL})`;

    // Release notes
    const body = `${versionChangelog}\n\n${links}`;

    await github.rest.repos.createRelease({
        draft: true,
        generate_release_notes: false,
        prerelease: true,
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: versionTag,
        name: versionTag,
        body,
    });
}

module.exports = main;

// Example use (run with `node .github/actions/release-note/index.js`)
if (require.main === module) main({
    context: { repo: { repo: 'design-system', owner: 'lumapps' }, sha: 'cdde1f3d1' },
    // Mocked GH API
    github: { rest: { repos: { createRelease: console.log } } },
});
