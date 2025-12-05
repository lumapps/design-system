const StyleDictionary = require("style-dictionary");
const tinycolor2 = require("tinycolor2");

/**
 * Color value transform to RGBA object with added opacity if provided.
 */
const name = "color/rgba-value";

StyleDictionary.registerTransform({
    name,
    type: "value",
    matcher: (prop) => /\bcolor\b/.exec(prop.name),
    transformer: ({ value, attributes = {} }) => {
        const color = tinycolor2(attributes.rgb);
        if (!color.getFormat() || color.getFormat() === "name") {
            // Skip if format "name" or undefined.
            return value;
        }
        return color.toRgbString();
    }
});
module.exports = name;
