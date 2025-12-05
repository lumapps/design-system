const StyleDictionary = require("style-dictionary");
const tinycolor2 = require("tinycolor2");

/**
 * Color value transform to RGBA object with added opacity if provided.
 */
const name = "color/attributes";

StyleDictionary.registerTransform({
    name,
    type: "attribute",
    matcher: (prop) => /\bcolor\b/.exec(prop.name),
    transformer: ({ value, attributes = {}, opacity = 1 }) => {
        const color = tinycolor2(value);
        if (!color.getFormat() || color.getFormat() === "name") {
            // Skip if format "name" or undefined.
            return attributes;
        }

        const colorWithAlpha = color.setAlpha(opacity);
        return { ...attributes, rgb: colorWithAlpha.toRgb(), hex: colorWithAlpha.toHex() };
    }
});
module.exports = name;
