const StyleDictionary = require('style-dictionary');

/**
 * Transform variable names.
 */
const name = 'name/lumx-variables';
StyleDictionary.registerTransform({
    name,
    type: 'name',
    transformer: (prop) => `lumx-${prop.path.join('-')}`,
});
module.exports = name;
