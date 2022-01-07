const StyleDictionary = require('style-dictionary');
const path = require('path');
const pickFieldsInTree = require('./utils/_pickFieldsInTree');
const transformGroup = require('./_transform-group');

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

            export const DESIGN_TOKENS = ${JSON.stringify(properties)}
        `;
    },
});

module.exports = () => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${path.resolve(baseDir, `../src/js/constants/`)}/`;

    return {
        source: [`${baseDir}/properties/**/*.json`],
        platforms: {
            ts: {
                transformGroup,
                buildPath,
                files: [
                    {
                        format,
                        destination: 'design-tokens.ts',
                        pickFields: [
                            'version',
                            'comment',
                            'value',
                            'attributes.hex',
                            'attributes.rgb',
                            '$aliasedFrom'
                        ],
                    },
                ],
                actions: [require('./utils/_prettier-ts')({ buildPath })],
            },
        },
    };
};
