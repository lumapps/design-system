const StyleDictionary = require('style-dictionary');
const execSync = require('child_process').execSync;
const path = require('path');

module.exports = function ({ buildPath }) {
    const name = 'prettier/style';
    StyleDictionary.registerAction({
        name,
        do: () => execSync(`yarn prettier --write '${path.resolve(buildPath)}/**'`),
    });
    return name;
};
