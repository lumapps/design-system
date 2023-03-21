const util = require('util');
const exec = util.promisify(require('child_process').exec);

const CONFIGS = ['gen-scss-variables', 'gen-ts-variables', 'gen-css-variables'];

async function main() {
    // For each config
    for (const config of CONFIGS) {
        // Run generation
        const { stdout } = await exec(`yarn node '${__dirname}/config/_run' '${config}'`).catch(e => e);
        console.log(stdout);
    }
}
main();
