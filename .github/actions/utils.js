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

module.exports = { getStoryBookURL, getShortSHA };
