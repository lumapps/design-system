const StyleDictionary = require("style-dictionary");

const name = "css/prefer-variable";

StyleDictionary.registerTransform({
    name,
    type: "value",
    matcher: (prop) => prop.preferCSSVariable,
    transformer: (prop, config) => {
        const extension = config.files[0].destination.replace(/.*\./, '');
        let name;
        if ((prop[`$config.${extension}`] || {}).aliasEquivalentCSSVariable) {
            // Keep original prop name.
            name = prop.name;
        } else if (prop.$aliasedFrom) {
            // Use the prop name for the original prop.
            name = ('lumx.'+prop.$aliasedFrom).replace(/\./g, '-');
        }

        if (!name) return prop.value;
        return`var(--${name})`;
    }
});
module.exports = name;
