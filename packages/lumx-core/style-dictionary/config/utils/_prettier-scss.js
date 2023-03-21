const StyleDictionary = require('style-dictionary');
const execSync = require('child_process').execSync;
const path = require('path');

module.exports = function () {
    const name = 'prettier/style';
    StyleDictionary.registerAction({
        name,
        do: (properties, config) => {
            const files = config.files.map(f => `'${path.resolve(config.buildPath, f.destination)}'`);
            return execSync(`yarn stylelint --fix ${files.join(' ')}`);
        },
    });
    return name;
};
