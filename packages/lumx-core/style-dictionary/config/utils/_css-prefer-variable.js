const StyleDictionary = require("style-dictionary");

const name = "css/prefer-variable";

StyleDictionary.registerTransform({
    name,
    type: "value",
    matcher: (prop) => prop.preferCSSVariable,
    transformer: (prop, config) => {
        let name;
        /*if (config.files[0].destination.endsWith('scss') && !prop.$aliasedFrom) {
            // In SCSS we'll always use the CSS variable
            name = prop.name;
        } else*/
        if (prop.$aliasedFrom) {
            // In other formats we'll only use the CSS variable if the value was
            // aliased.
            name = prop.$aliasedFrom.replace(/\./g, '-');
        }

        if (!name) return prop.value;
        return`var(--lumx-${name})`;
    }
});
module.exports = name;
