const StyleDictionary = require('style-dictionary');
const path = require('path');
const exec = require('./_exec.cjs');

module.exports = function () {
    const name = 'prettier/style';
    StyleDictionary.registerAction({
        name,
        do: (properties, config) => {
            const files = config.files.map(f => `'${path.resolve(config.buildPath, f.destination)}'`);
            exec(`yarn stylelint --fix ${files.join(' ')}`);
        },
        undo: () => null,
    });
    return name;
};
