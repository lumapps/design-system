const exec = require('child_process').exec;

const CONFIGS = ['gen-scss-variables', 'gen-ts-variables'];
const GLOBAL_THEMES = ['lumapps', 'material'];

// For each config
for (const config of CONFIGS) {
    // For each theme.
    for (const globalTheme of GLOBAL_THEMES) {
        exec(`yarn node '${__dirname}/config/_run' '${config}' '${globalTheme}'`, (error, stdout, stderr) => {
            console.error(stderr);
            console.log(stdout);
        });
    }
}
