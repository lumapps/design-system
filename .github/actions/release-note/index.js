/* eslint-disable */

const fs = require('fs');

const { getStoryBookURL, getShortSHA } = require('../utils');
const { CHANGELOG_PATH } = require('../../../configs/path');
const { extractLatestVersionSection } = require('@lumx/changelog-utils');

/**
 * Generate release note and create a release on GH.
 */
async function main({ github, context }) {
    const [shortSHA, changelog] = await Promise.all([
        getShortSHA(context.sha),
        fs.promises.readFile(CHANGELOG_PATH, 'utf8'),
    ]);
    const { version, text: versionChangelog } = extractLatestVersionSection(changelog);
    const versionTag = `v${version}`;

    // Related links
    const changelogURL = `https://github.com/lumapps/design-system/blob/${versionTag}/CHANGELOG.md`;
    const links = [
        `[🎨 StoryBook React](${getStoryBookURL(shortSHA, 'lumx-react')})`,
        `[🎨 StoryBook Vue](${getStoryBookURL(shortSHA, 'lumx-vue')})`,
        `[📄 See changelog history](${changelogURL})`,
    ].join(' - ');

    // Release notes
    const body = `${versionChangelog}\n\n${links}`;

    await github.rest.repos.createRelease({
        draft: false,
        generate_release_notes: false,
        prerelease: false,
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: versionTag,
        name: versionTag,
        body,
    });
}

module.exports = main;

// Example use (run with `node .github/actions/release-note/index.js`)
if (require.main === module)
    main({
        context: { repo: { repo: 'design-system', owner: 'lumapps' }, sha: 'cdde1f3d1' },
        // Mocked GH API
        github: { rest: { repos: { createRelease: console.log } } },
    });
