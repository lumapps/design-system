const StyleDictionary = require("style-dictionary");

/**
 * Transform group:
 */
const name = "transform-group-custom";
StyleDictionary.registerTransformGroup({
    name,
    transforms: [
        require("./utils/_lumx-variables"),
        require("./utils/_color-attributes"),
        require("./utils/_color-rgba-value"),
        require("./utils/_css-prefer-variable")
    ]
});
module.exports = name;
