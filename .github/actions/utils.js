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
async function getStoryBookURL(gitRef, package = 'lumx-react') {
    const { projectId } = require(`./packages/${package}/chromatic.config.json`);
    const cleanProjectId = projectId.replace('Project:', '');
    const shortSHA = await getShortSHA(gitRef);
    return `https://${shortSHA}--${cleanProjectId}.chromatic.com/`;
}

module.exports = { getStoryBookURL, getShortSHA };
