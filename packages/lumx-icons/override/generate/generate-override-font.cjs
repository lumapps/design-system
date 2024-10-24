const svgtofont = require('svgtofont');
const path = require('path');
const overrideConfig = require('../override-icons/config');
const {
    INPUT_ICON_OVERRIDE_DIR,
    GENERATED_TMP_DIR,
    OVERRIDE_FONT_NAME
} = require('./constants.cjs');

/**
 * Convert input SVG icons into fonts and JSON path file.
 *
 * 1. Loads individual SVG icons in INPUT_ICON_OVERRIDE_DIR
 * 2. Map them to a position in the font `getIconUnicode` based on the CSS character code
 * 3. Output font in all major formats (ttf, woff, etc.)
 * 4. Output override icon paths in JSON (used to export TS)
 */
async function generateOverrideFont() {
    console.debug('Override font icons...');
    return svgtofont({
        // Input dir containing SVG icons to integrate into a font
        src: INPUT_ICON_OVERRIDE_DIR,
        // Map icon to their location in the font (unicode code point)
        getIconUnicode(name) {
            const iconConfig = overrideConfig[name];
            if (!iconConfig) throw new Error(`No config for icon ${name}`);
            // Use unicode code point converted from CSS format
            const { unicode } = iconConfig;
            return [String.fromCodePoint(unicode)];
        },
        // Output dir
        dist: path.resolve(GENERATED_TMP_DIR),
        // Output font name
        fontName: OVERRIDE_FONT_NAME,
        svgicons2svgfont: {
            // upscale to 1000dp to avoid vector deformation
            fontHeight: 1000,
            // MDI icons are 24/24dp and the margin is 3dp
            descent: (1000 * 3) / 24,
        },
        // Output SVG path in a JSON
        outSVGPath: true,
        // Disables unwanted output files:
        css: false,
        outSVGReact: false,
    });
}

module.exports = generateOverrideFont;
