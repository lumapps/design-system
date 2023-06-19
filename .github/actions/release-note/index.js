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
async function main({ versionTag, github, context }) {
    const [{ version, versionChangelog }, storybookURL] = await Promise.all([
        getLatestVersionChangelog(),
        getStoryBookURL(versionTag),
    ]);

    const changelogURL = `https://github.com/lumapps/design-system/blob/${versionTag}/CHANGELOG.md`;

    // Release notes
    const body = `### [🎨 StoryBook](${storybookURL})\n\n### [📄 Changelog](${changelogURL})\n\n${versionChangelog}`;

    await github.rest.repos.createRelease({
        draft: false,
        generate_release_notes: false,
        prerelease: false,
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: versionTag,
        name: `v${version}`,
        body,
    });
}

module.exports = main;

// Example use (run with `node .github/actions/release-note/index.js`)
if (require.main === module) main({
    versionTag: 'v3.0.5',
    context: { repo: { repo: 'design-system', owner: 'lumapps' } },
    // Mocked GH API
    github: { rest: { repos: { createRelease: console.log } } },
});
