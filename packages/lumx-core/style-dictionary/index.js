const exec = require('child_process').exec;

const CONFIGS = ['gen-scss-theme-variables', 'gen-ts-theme-variables'];
const THEMES = ['lumapps', 'material'];

// For each config
for (const config of CONFIGS) {
    // For each theme.
    for (const theme of THEMES) {
        exec(`yarn node '${__dirname}/config/_run' '${config}' '${theme}'`, (error, stdout, stderr) => {
            console.error(stderr);
            console.log(stdout);
        });
    }
}
