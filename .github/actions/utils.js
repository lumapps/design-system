const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Get short SHA for git ref.
 */
async function getShortSHA(gitRef) {
    return exec(`git rev-parse --short ${gitRef}`)
        .then(({ stdout }) => stdout.trim());
}

/**
 * Generate StoryBook URL for the given git ref.
 */
async function getStoryBookURL(gitRef) {
    const { project_id } = require('../../configs/chromatic');
    const shortSHA = await getShortSHA(gitRef);
    return `https://${shortSHA}--${project_id}.chromatic.com/`;
}

module.exports = { getStoryBookURL, getShortSHA };
