const StyleDictionary = require('style-dictionary');
const lumxVariableName = require('./_lumx-variables');

/**
 * Transform group:
 */
const name = 'css-transform-group-custom';
StyleDictionary.registerTransformGroup({
    name,
    transforms: ['attribute/cti', lumxVariableName, require('./_color-opacity'), 'color/css'],
});
module.exports = name;
