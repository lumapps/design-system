const { getShortSHA, getStoryBookURL } = require('../utils');

/**
 * Init variables for storybook/chromatic deploy
 * @param {import("@actions/github").context} context     github-script context
 * @param {import("@actions/core")}           core        github-script core
 * @param {"lumx-react" | "lumx-vue"}         packageName package name
 */
async function run(context, core, packageName) {
    try {
        // Path to package
        const package_path = `packages/${packageName}`;

        // Link to the current run on GitHub website
        const run_html_url = `${context.payload.repository.html_url}/actions/runs/${context.runId}?pr=${context.payload.pull_request?.number}`;

        // StoryBook URL
        const shortSHA = await getShortSHA(context.payload.pull_request?.head?.sha || context.sha);
        const storybook_url = getStoryBookURL(shortSHA, packageName);

        // Output all config values
        const outputs = {
            storybook_url,
            run_html_url,
            package_path,
        };
        for (const [key, value] of Object.entries(outputs)) {
            core.setOutput(key, value);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = { run };
