const StyleDictionary = require('style-dictionary');
const path = require('path');
const pickFieldsInTree = require('./utils/_pickFieldsInTree.cjs');
const transformGroup = require('./_transform-group.cjs');

/**
 * Typescript generator:
 */
function customFormat({ pickFields }) {
    const name = 'typescript/map-deep';
    StyleDictionary.registerFormat({
        name,
        formatter({ file, dictionary }) {
            const properties = pickFieldsInTree(dictionary.properties, pickFields);
            const header = StyleDictionary.formatHelpers.fileHeader({ file });
            const code = `export const DESIGN_TOKENS = ${JSON.stringify(properties)}`;
            return `${header}\n\n${code}`;
        },
    });
    return name;
}

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
                        format: customFormat({
                            pickFields: [
                                'version',
                                'comment',
                                'value',
                                'attributes.hex',
                                'attributes.rgb',
                                '$aliasedFrom'
                            ],
                        }),
                        destination: 'design-tokens.ts',
                    },
                ],
                actions: [require('./utils/_action-prettier-ts.cjs')({ buildPath })],
            },
        },
    };
};
