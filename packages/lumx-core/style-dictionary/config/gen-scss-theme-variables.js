const StyleDictionary = require('style-dictionary');

/**
 * Transform SCSS variable names.
 */
const lumxVariableName = 'name/scss/lumx-variables';
StyleDictionary.registerTransform({
    name: lumxVariableName,
    type: 'name',
    transformer: (prop) => `lumx-theme-${prop.path.splice(1).join('-')}`,
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

module.exports = ({ theme }) => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${baseDir}/../src/scss/core/theme/generated/${theme}/`;
    return {
        source: [
            `${baseDir}/properties/theme/**/base.json`,
            `${baseDir}/properties/theme/**/${theme}.json`,
        ],
        platforms: {
            scss: {
                transformGroup,
                buildPath,
                files: [{
                    destination: '_variables.scss',
                    format: 'scss/map-deep',
                    mapName: 'lumx-theme',
                }],
                actions: [require('./utils/_prettier-scss')({ buildPath })],
            },
        },
    };
};
