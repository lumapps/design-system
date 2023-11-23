const camelCase = require('lodash/camelCase');
const path = require('path');
const fs = require('fs/promises');
const { GENERATED_DIR, GENERATED_TMP_DIR, OUT_OVERRIDE_NAME, OVERRIDE_FONT_NAME } = require('./constants.cjs');

/**
 * Generate TypeScript module exporting the icons paths.
 */
async function generateTSOverride() {
    const iconsJSONFilePath = path.resolve(GENERATED_TMP_DIR, `${OVERRIDE_FONT_NAME}.json`);
    const iconJSONFile = await fs.readFile(iconsJSONFilePath);
    const icons = JSON.parse(iconJSONFile.toString());

    // Generate TS const export to override MDI icons
    const iconOverrideExports = [];
    for (const [icon, paths] of Object.entries(icons)) {
        if (paths.length !== 1) throw new Error('Only single path icon are supported');
        iconOverrideExports.push(`export const ${camelCase(`mdi-${icon}`)} =\n    '${paths[0]}';`);
    }

    // Output TS file
    const lines = [
        // Re-export MDI icons
        `export * from '@mdi/js';`,
        // Override MDI icons we just re-exported
        ...iconOverrideExports,
    ];
    const tsOverrideFile = path.resolve(GENERATED_DIR, `${OUT_OVERRIDE_NAME}.ts`);
    await fs.writeFile(tsOverrideFile, `${lines.join('\n\n')}\n`);
}

module.exports = generateTSOverride;
