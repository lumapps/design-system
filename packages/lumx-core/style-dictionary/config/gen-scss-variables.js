const StyleDictionary = require('style-dictionary');

/**
 * Transform SCSS variable names.
 */
const lumxVariableName = 'name/scss/lumx-variables';
StyleDictionary.registerTransform({
    name: lumxVariableName,
    type: 'name',
    transformer: (prop) => `lumx-${prop.path.join('-')}`,
});

/**
 * Transform group:
 */
const transformGroup = 'scss-custom';
StyleDictionary.registerTransformGroup({
    name: transformGroup,
    transforms: [
        'attribute/cti',
        lumxVariableName,
        require('./utils/_color-opacity'),
        'color/css',
    ],
});

module.exports = ({ globalTheme }) => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${baseDir}/../src/scss/core/generated/${globalTheme}/`;
    return {
        source: [
            `${baseDir}/properties/**/base.json`,
            `${baseDir}/properties/**/${globalTheme}.json`,
        ],
        platforms: {
            scss: {
                transformGroup,
                buildPath,
                files: [{
                    destination: '_variables.scss',
                    format: 'scss/map-deep',
                    mapName: 'lumx-core'
                }],
                actions: [require('./utils/_prettier-scss')({ buildPath })],
            },
        },
    };
};
