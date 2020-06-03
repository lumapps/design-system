const StyleDictionary = require('style-dictionary');
const tinycolor2 = require('tinycolor2');

/**
 * Style dictionary color property value transform applying opacity to the original color value.
 */
const name = 'color/opacity';
StyleDictionary.registerTransform({
    name,
    type: 'value',
    matcher: (prop) => prop.attributes.category === 'color' && !!prop.opacity,
    transformer: (prop) => tinycolor2(prop.value).setAlpha(prop.opacity).toRgbString(),
});
module.exports = name;
