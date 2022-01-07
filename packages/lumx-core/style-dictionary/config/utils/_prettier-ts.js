const StyleDictionary = require('style-dictionary');
const execSync = require('child_process').execSync;
const path = require('path');
const bin = path.resolve(__dirname, '../../../../../node_modules/.bin');

module.exports = function ({ buildPath }) {
    const name = 'prettier/ts';
    StyleDictionary.registerAction({
        name,
        do: () => execSync(`${bin}/eslint --fix '${path.resolve('/home/gcornut/git/design-system/packages/lumx-core/src/js/constants/design-tokens.ts')}'`),
    });
    return name;
};
