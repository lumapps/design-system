const StyleDictionary = require("style-dictionary");

/**
 * Transform group:
 */
const name = "transform-group-custom";
StyleDictionary.registerTransformGroup({
    name,
    transforms: [
        require("./utils/_lumx-variables.cjs"),
        require("./utils/_color-attributes.cjs"),
        require("./utils/_color-rgba-value.cjs"),
        require("./utils/_css-prefer-variable.cjs")
    ]
});
module.exports = name;
