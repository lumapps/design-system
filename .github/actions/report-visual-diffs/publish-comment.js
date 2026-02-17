const fs = require('fs/promises');

const { md } = require('./md');

const COMMENT_MARKER = '<!-- vis-report -->';

/**
 * Find an existing PR comment with the visual report marker.
 * @param {import("@octokit/rest").Octokit} github
 * @param {string} owner
 * @param {string} repo
 * @param {number} prNumber
 * @returns {Promise<{ id: number } | null>}
 */
async function findComment(github, owner, repo, prNumber) {
    const iterator = github.paginate.iterator(github.rest.issues.listComments, {
        owner,
        repo,
        issue_number: prNumber,
        per_page: 100,
    });

    for await (const { data: comments } of iterator) {
        for (const comment of comments) {
            if (comment.body && comment.body.includes(COMMENT_MARKER)) {
                return comment;
            }
        }
    }
    return null;
}

/**
 * Main entry point for publishing the PR comment.
 *
 * @param {Object} params
 * @param {import("@octokit/rest").Octokit} params.github - Octokit instance
 * @param {import("@actions/github").context} params.context - GitHub Actions context
 * @param {string} params.commentBodyPath - Path to file containing the comment body
 */
async function main({ github, context, commentBodyPath }) {
    const { owner, repo } = context.repo;
    const prNumber = context.issue.number;

    let commentBody = await fs.readFile(commentBodyPath, 'utf8');
    commentBody = COMMENT_MARKER + '\n' + md.heading(2, 'Visual Regression Report') + '\n' + commentBody;
    console.log(`Comment body size: ${commentBody.length} chars`);

    // Find existing comment
    const existingComment = await findComment(github, owner, repo, prNumber);

    // Delete existing comment if any, then create a new one
    if (existingComment) {
        console.log(`Deleting existing comment #${existingComment.id}`);
        await github.rest.issues.deleteComment({
            owner,
            repo,
            comment_id: existingComment.id,
        });
    }

    console.log('Creating new comment');
    await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: commentBody,
    });

    console.log('Comment published successfully');
}

module.exports = main;
