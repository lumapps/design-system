const StyleDictionary = require('style-dictionary');
const execSync = require('child_process').execSync;
const path = require('path');
const bin = path.resolve(__dirname, '../../../../../node_modules/.bin');

module.exports = function ({ buildPath }) {
    const name = 'prettier/style';
    StyleDictionary.registerAction({
        name,
        do: () => execSync(`${bin}/prettier --write '${path.resolve(buildPath)}/**'`),
    });
    return name;
};
