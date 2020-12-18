const StyleDictionary = require('style-dictionary');
const execSync = require('child_process').execSync;

module.exports = function ({ buildPath }) {
    const name = 'prettier/ts';
    StyleDictionary.registerAction({
        name,
        do: () => execSync(`yarn eslint --fix '${buildPath}'`),
    });
    return name;
};
