const StyleDictionary = require('style-dictionary');

/**
 * Transform group:
 */
const transformGroup = 'ts-custom';
StyleDictionary.registerTransformGroup({
    name: transformGroup,
    transforms: [
        'attribute/cti',
        'name/cti/pascal',
        require('./utils/_color-opacity'),
        'color/css',
        'attribute/color',
    ],
});

/**
 * Typescript generator:
 */
const format = 'typescript/map-deep';
StyleDictionary.registerFormat({
    name: format,
    formatter: (dictionary) => `
        /**
         * Do not edit directly
         * Generated on ${new Date().toUTCString()}
         */

        export const THEME = ${JSON.stringify(dictionary.properties, null, 2)}
    `,
});


module.exports = ({ theme }) => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${baseDir}/../src/js/constants/generated/`;
    return {
        source: [
            `${baseDir}/properties/theme/**/base.json`,
            `${baseDir}/properties/theme/**/${theme}.json`,
        ],
        platforms: {
            ts: {
                transformGroup,
                buildPath,
                files: [{
                    format, destination: `${theme}.ts`,
                }],
                actions: [require('./utils/_prettier-ts')({ buildPath })],
            },
        },
    };
};
