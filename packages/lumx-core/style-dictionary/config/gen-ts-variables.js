const StyleDictionary = require('style-dictionary');
const pickFieldsInTree = require('./utils/_pickFieldsInTree');

/**
 * Transform group:
 */
const transformGroup = 'ts-custom';
StyleDictionary.registerTransformGroup({
    name: transformGroup,
    transforms: ['attribute/cti', 'name/cti/pascal', require('./utils/_color-opacity'), 'color/css', 'attribute/color'],
});

/**
 * Typescript generator:
 */
const format = 'typescript/map-deep';
StyleDictionary.registerFormat({
    name: format,
    formatter(dictionary) {
        const properties = this.pickFields
            ? pickFieldsInTree(dictionary.properties, this.pickFields)
            : dictionary.properties;
        return `
            ${require('./utils/_genHeader')()}

            export const CORE = ${JSON.stringify(properties, null, 2)}
        `;
    },
});

module.exports = () => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${baseDir}/../src/js/constants/generated/`;
    return {
        source: [`${baseDir}/properties/**/base.json`],
        platforms: {
            ts: {
                transformGroup,
                buildPath,
                files: [
                    {
                        format,
                        destination: 'constants.ts',
                        pickFields: [
                            'version',
                            'comment',
                            'attributes.category',
                            'attributes.type',
                            'attributes.item',
                            'attributes.hex',
                            'attributes.rgb',
                        ],
                    },
                ],
                actions: [require('./utils/_prettier-ts')({ buildPath })],
            },
        },
    };
};
