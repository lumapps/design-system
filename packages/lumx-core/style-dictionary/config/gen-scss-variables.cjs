const StyleDictionary = require('style-dictionary');
const path = require('path');
const _ = require('lodash');
const transformGroup = require('./_transform-group.cjs');
const prependStylelintDisable = require('./utils/_format-stylelint-disable.cjs');

/**
 * SCSS generator
 * Inspired by https://raw.githubusercontent.com/amzn/style-dictionary/9d867ef3ad72cf68557434ce1a28ba996a5ac467/lib/common/templates/scss/map-deep.template
 */
function customFormat() {
    const format = 'scss/custom-map-deep';
    StyleDictionary.registerFormat({
        name: format,
        formatter({ file, dictionary, depth = 0 }) {
            // List SCSS variables.
            const scssVariables = dictionary.allProperties
                .map(({ name, value, comment }) => `$${name}: ${value} !default;${comment ? ` // ${comment}` : ''}`)
                .join('\n');

            // Build SCSS map (from SCSS variable values).
            function processProperties(prop) {
                const indent = '  '.repeat(depth + 1);
                if (prop.hasOwnProperty('value')) {
                    return `$${prop.name}`;
                } else {
                    const subProps = Object.keys(prop)
                        .filter(key => !key.startsWith('$') && _.isPlainObject(prop[key]))
                        .map((key) => `${indent}'${key}': ${processProperties(prop[key], depth + 1)}`)
                        .join(',\n');
                    return `(\n${subProps}\n${'  '.repeat(depth)})`;
                }
            }

            const scssMap = `$lumx-design-tokens: ${processProperties(dictionary.properties)} !default;`;

            const header = StyleDictionary.formatHelpers.fileHeader({ file });
            return [header, scssVariables, scssMap].join('\n\n');
        },
    });
    return format;
}

module.exports = () => {
    const baseDir = `${__dirname}/../`;
    const buildPath = `${path.resolve(baseDir, `../src/scss/`)}/`;
    return {
        source: [`${baseDir}/properties/**/*.json`],
        platforms: {
            scss: {
                transformGroup,
                buildPath,
                files: [
                    {
                        destination: '_design-tokens.scss',
                        format: prependStylelintDisable(customFormat()),
                    },
                ],
                actions: [require('./utils/_action-prettier-style.cjs')()],
            },
        },
    };
};
