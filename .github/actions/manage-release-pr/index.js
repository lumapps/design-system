/* eslint-disable */

const fs = require('fs');

/**
 * Find the existing release PR (any open PR with head.ref starting with 'release/').
 * @returns {{ frozen: boolean, prNumber: number, headRef: string }}
 */
async function findReleasePR(github, context) {
    const { data: prs } = await github.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        base: 'master',
        state: 'open',
    });
    const pr = prs.find((p) => p.head.ref.startsWith('release/'));
    const frozen = pr ? !pr.draft : false;
    const prNumber = pr?.number || 0;
    const headRef = pr?.head.ref || '';
    console.log(
        pr
            ? `Found release PR #${prNumber} on branch '${headRef}' (draft=${pr.draft}, frozen=${frozen})`
            : 'No release PR found',
    );
    return { frozen, prNumber, headRef };
}

/**
 * Build the PR body for the release PR.
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
 * Create or update the release draft PR.
 * If an existing release PR is found on a different branch, close it and delete its branch first.
 */
async function createOrUpdatePR(github, context, { prNumber, headRef, releaseBranch, nextVersion, prereleaseVersion, runUrl }) {
    const title = `chore(release): release v${nextVersion}`;
    const body = buildPRBody({ nextVersion, prereleaseVersion, runUrl });

    // If existing PR is on a different branch (version changed), close it and delete its branch.
    if (prNumber && headRef && headRef !== releaseBranch) {
        console.log(`Release version changed: closing old PR #${prNumber} on '${headRef}', opening new one on '${releaseBranch}'`);
        await github.rest.pulls.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: prNumber,
            state: 'closed',
        });
        try {
            await github.rest.git.deleteRef({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: `heads/${headRef}`,
            });
            console.log(`Deleted old branch '${headRef}'`);
        } catch (e) {
            console.log(`Warning: could not delete old branch '${headRef}': ${e.message}`);
        }
        // Reset so we create a new PR below
        prNumber = 0;
    }

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
            head: releaseBranch,
            base: 'master',
            title,
            body,
            draft: true,
        });
        console.log(`Created draft PR #${pr.number} on branch '${releaseBranch}'`);
    }
}

/**
 * Main entry point.
 * @param {object} options
 * @param {'check' | 'update' | 'fail-when-frozen'} options.mode
 */
async function main({ github, context, core, mode, nextVersion, prereleaseVersion, runUrl }) {
    const { frozen, prNumber, headRef } = await findReleasePR(github, context);

    if (mode === 'check') {
        core.setOutput('frozen', String(frozen));
        core.setOutput('prNumber', String(prNumber));
        return;
    }

    if (mode === 'fail-when-frozen') {
        if (frozen) {
            core.setFailed('Merges blocked: release is being prepared (release PR is frozen)');
        }
        return;
    }

    if (mode === 'update') {
        const releaseBranch = `release/${nextVersion}`;
        await createOrUpdatePR(github, context, { prNumber, headRef, releaseBranch, nextVersion, prereleaseVersion, runUrl });
        return;
    }

    throw new Error(`Unknown mode: ${mode}. Expected 'check', 'update', or 'fail-when-frozen'.`);
}

module.exports = main;
