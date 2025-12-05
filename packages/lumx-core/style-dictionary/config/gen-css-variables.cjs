const path = require('path');
const transformGroup = require('./_transform-group.cjs');
const prependStylelintDisable = require('./utils/_format-stylelint-disable.cjs');

module.exports = () => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${path.resolve(baseDir, `../src/css/`)}/`;

    return {
        source: [`${baseDir}/properties/**/*.json`],
        platforms: {
            css: {
                transformGroup,
                buildPath,
                files: [
                    {
                        format: prependStylelintDisable('css/variables'),
                        destination: 'design-tokens.css',
                        // Filter out null values
                        filter: (token) => token.value !== null,
                    },
                ],
                actions: [require('./utils/_action-prettier-style.cjs')()],
            },
        },
    };
};
