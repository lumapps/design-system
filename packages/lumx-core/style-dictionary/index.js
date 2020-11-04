const exec = require('child_process').exec;

const CONFIGS = ['gen-scss-variables', 'gen-ts-variables'];

// For each config
for (const config of CONFIGS) {
    exec(`yarn node '${__dirname}/config/_run' '${config}'`, (error, stdout, stderr) => {
        console.error(stderr);
        console.log(stdout);
    });
}
