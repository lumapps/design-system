const util = require('util');
const exec = util.promisify(require('child_process').exec);

const CONFIGS = ['gen-scss-variables', 'gen-ts-variables', 'gen-css-variables'];

async function main() {
    // For each config
    for (const config of CONFIGS) {
      console.log('Running', config, '...');
      // Run generation
      exec(`yarn node '${__dirname}/config/_run.cjs' '${config}'`)
          .then(({ stdout, stderr }) => {
              console.log(stdout.toString(), stderr.toString());
          });
    }
}
main();
