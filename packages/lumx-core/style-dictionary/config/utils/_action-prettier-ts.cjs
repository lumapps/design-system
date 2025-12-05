const StyleDictionary = require('style-dictionary');
const path = require('path');
const exec = require('./_exec.cjs');

module.exports = function({ buildPath }) {
    const name = 'prettier/ts';
    StyleDictionary.registerAction({
        name,
        do: () => exec(`yarn eslint --fix '${path.resolve(buildPath)}'`),
        undo: () => null,
    });
    return name;
};
