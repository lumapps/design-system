const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Get short SHA for git ref.
 */
async function getShortSHA(gitRef) {
    return exec(`git rev-parse --short ${gitRef}`).then(({ stdout }) => stdout.trim());
}

/**
 * Generate StoryBook URL for the given git ref.
 * @param shortSHA git commit short SHA
 * @param packageName {'lumx-react' | 'lumx-vue'} package name
 */
function getStoryBookURL(shortSHA, packageName) {
    const { projectId } = require(`${__dirname}/../../packages/${packageName}/chromatic.config.json`);
    const cleanProjectId = projectId.replace('Project:', '');
    return `https://${shortSHA}--${cleanProjectId}.chromatic.com/`;
}

/**
 * Find an open PRs for the given branch.
 * @param {InstanceType<typeof import('@actions/github').getOctokit>} github  Octokit instance
 * @param {{ owner: string, repo: string }}                          repoInfo owner and repo
 * @param {string}                                                   branch   branch name
 * @returns {Promise<{ number: number }[]>} the PR, or undefined if none found
 */
async function findPRs(github, { owner, repo }, branch) {
    const { data: pulls } = await github.rest.pulls.list({
        owner,
        repo,
        head: `${owner}:${branch}`,
        state: 'open',
    });
    return pulls;
}

/**
 * Build the GitHub Actions run URL.
 * @param {string} repoUrl   repository HTML URL
 * @param {number} runId     workflow run ID
 * @param {string} [prNumber] optional PR number
 */
function getRunURL(repoUrl, runId, prNumber) {
    return `${repoUrl}/actions/runs/${runId}${prNumber ? `?pr=${prNumber}` : ''}`;
}

module.exports = { getStoryBookURL, getShortSHA, findPRs, getRunURL };
