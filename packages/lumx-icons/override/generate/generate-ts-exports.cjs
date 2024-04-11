const path = require('node:path');
const fs = require('node:fs/promises');

const { exec, formatMdiName } = require('./utils.cjs');
const { GENERATED_DIR, JSON_ICON_LIBRARY_FILE } = require('./constants.cjs');

/**
 * Generate TS icons
 *
 * 1. Load JSON icon library
 * 2. Output icons and alias icons to a TS file
 */
module.exports = async function generateTSExports() {
    console.debug('Generating TS file...');
    const { icons } = JSON.parse(await fs.readFile(path.resolve(GENERATED_DIR, JSON_ICON_LIBRARY_FILE)));

    const outFile = path.resolve(GENERATED_DIR, `index.ts`);
    await fs.writeFile(outFile, ``);

    // Output icon values
    for (const { name, path } of icons) {
        await fs.appendFile(outFile, `export const ${formatMdiName(name)}: string = '${path}';\n\n`);
    }

    // Output icon aliases
    for (const { name, aliases } of icons) {
        if (!aliases) continue;
        // ex: "mdiXTwitter as mdiTwitter, mdiXTwitter as mdiTwitterBox"
        const exports = aliases.map(alias => `${formatMdiName(name)} as ${formatMdiName(alias)}`).join(', ');
        await fs.appendFile(outFile, `export { ${exports} };\n\n`);
    }

    console.debug('Reformat TS file...');
    await exec(`yarn prettier --write '${outFile}'`);
};
