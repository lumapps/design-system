/* eslint-disable */

const fs = require('fs');

const { getStoryBookURL, getShortSHA } = require('../utils');
const { CHANGELOG_PATH } = require('../../../configs/path');
const { extractLatestVersionSection } = require('../../../dev-packages/changelog-utils');

/**
 * Generate release note and create a release on GH.
 */
async function main({ github, context }) {
    const [shortSHA, changelog] = await Promise.all([
        // Use HEAD (checked-out commit) instead of context.sha (merge commit) so the
        // Storybook URL matches the tagged commit, enabling Chromatic version correlation.
        getShortSHA('HEAD'),
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

    // Idempotent: update the release if it already exists, create otherwise.
    const releaseParams = {
        draft: false,
        generate_release_notes: false,
        prerelease: false,
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag_name: versionTag,
        name: versionTag,
        body,
    };
    try {
        await github.rest.repos.createRelease(releaseParams);
    } catch (error) {
        if (error.status === 422) {
            const { data: existing } = await github.rest.repos.getReleaseByTag({
                owner: context.repo.owner,
                repo: context.repo.repo,
                tag: versionTag,
            });
            await github.rest.repos.updateRelease({
                ...releaseParams,
                release_id: existing.id,
            });
            console.log(`Release ${versionTag} already existed, updated.`);
        } else {
            throw error;
        }
    }
}

module.exports = main;

// Example use (run with `node .github/actions/release-note/index.js`)
if (require.main === module)
    main({
        context: { repo: { repo: 'design-system', owner: 'lumapps' }, sha: 'cdde1f3d1' },
        // Mocked GH API
        github: { rest: { repos: { createRelease: console.log } } },
    });
