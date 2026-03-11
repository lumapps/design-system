/* eslint-disable */

const fs = require('fs');

/**
 * Find the existing release/next PR.
 * @returns {{ frozen: boolean, prNumber: number }}
 */
async function findReleasePR(github, context) {
    const { data: prs } = await github.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        head: `${context.repo.owner}:release/next`,
        state: 'open',
    });
    const pr = prs[0];
    const frozen = pr ? !pr.draft : false;
    const prNumber = pr?.number || 0;
    console.log(
        pr ? `Found release/next PR #${prNumber} (draft=${pr.draft}, frozen=${frozen})` : 'No release/next PR found',
    );
    return { frozen, prNumber };
}

/**
 * Build the PR body for the release/next PR.
 */
function buildPRBody({ nextVersion, prereleaseVersion, runUrl }) {
    const lines = [
        `# Release v${nextVersion}`,
        '',
        'Auto-updated on each merge to master.',
        '- **Draft** = auto-updated on new merges',
        "- **Ready** = frozen, new merges won't update this PR",
        '',
        'Merge to publish the official release to NPM.',
    ];

    if (prereleaseVersion) {
        lines.push(
            '',
            '---',
            '',
            `Latest prerelease: \`${prereleaseVersion}\` ([workflow run](${runUrl}))`,
            '```',
            `yarn up '@lumx/*@${prereleaseVersion}'`,
            '```',
        );
    }

    // Extract unreleased changelog section (lazy require: only needed in update mode, after yarn install)
    try {
        const { CHANGELOG_PATH } = require('../../../configs/path');
        const { extractUnreleasedSection } = require('@lumx/changelog-utils');
        const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
        const unreleased = extractUnreleasedSection(changelog);
        if (unreleased) {
            lines.push('', '---', '', '## Changelog (unreleased)', '', unreleased);
        }
    } catch (e) {
        console.log(`Warning: could not extract unreleased changelog: ${e.message}`);
    }

    return lines.join('\n');
}

/**
 * Create or update the release/next draft PR.
 */
async function createOrUpdatePR(github, context, { prNumber, nextVersion, prereleaseVersion, runUrl }) {
    const title = `chore(release): release v${nextVersion}`;
    const body = buildPRBody({ nextVersion, prereleaseVersion, runUrl });

    if (prNumber) {
        await github.rest.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: prNumber,
            title,
            body,
        });
        console.log(`Updated PR #${prNumber}`);
    } else {
        const { data: pr } = await github.rest.pulls.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            head: 'release/next',
            base: 'master',
            title,
            body,
            draft: true,
        });
        console.log(`Created draft PR #${pr.number}`);
    }
}

/**
 * Main entry point.
 * @param {object} options
 * @param {'check' | 'update' | 'fail-when-frozen'} options.mode
 */
async function main({ github, context, core, mode, nextVersion, prereleaseVersion, runUrl }) {
    const { frozen, prNumber } = await findReleasePR(github, context);

    if (mode === 'check') {
        core.setOutput('frozen', String(frozen));
        core.setOutput('prNumber', String(prNumber));
        return;
    }

    if (mode === 'fail-when-frozen') {
        if (frozen) {
            core.setFailed('Merges blocked: release is being prepared (release/next PR is frozen)');
        }
        return;
    }

    if (mode === 'update') {
        await createOrUpdatePR(github, context, { prNumber, nextVersion, prereleaseVersion, runUrl });
        return;
    }

    throw new Error(`Unknown mode: ${mode}. Expected 'check', 'update', or 'fail-when-frozen'.`);
}

module.exports = main;
