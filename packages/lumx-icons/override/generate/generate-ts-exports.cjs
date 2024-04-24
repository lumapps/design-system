const nodePath = require('node:path');
const fs = require('node:fs/promises');

const { exec, formatMdiName } = require('./utils.cjs');
const { PACKAGE_DIR, GENERATED_DIR, JSON_ICON_LIBRARY_FILE } = require('./constants.cjs');

const ICONS_DIR = 'all';

/**
 * Generate TS icons
 *
 * 1. Load JSON icon library
 * 2. Output icons and alias icons to a TS file
 */
module.exports = async function generateTSExports() {
    console.debug('Generating TS file...');
    const { icons } = JSON.parse(await fs.readFile(nodePath.resolve(GENERATED_DIR, JSON_ICON_LIBRARY_FILE)));

    // Output icon files
    for (const { name, path } of icons) {
        const mdiName = formatMdiName(name);
        const iconFile = nodePath.join(PACKAGE_DIR, ICONS_DIR, `${mdiName}.js`);
        await fs.writeFile(iconFile, `export const ${mdiName} = '${path}';\n`);
        const iconDTSFile = nodePath.join(PACKAGE_DIR, ICONS_DIR, `${mdiName}.d.ts`);
        await fs.writeFile(iconDTSFile, `export declare const ${mdiName}: string;\n`);
    }

    // Output icon aliases
    const allExports = [];
    for (const { name, aliases } of icons) {
        const mdiName = formatMdiName(name);
        const iconModule = nodePath.join(ICONS_DIR, mdiName);

        const exports = [mdiName];
        if (aliases) {
            exports.push(...aliases.map(alias => `${mdiName} as ${formatMdiName(alias)}`));
        }

        // ex: "mdiTwitter, mdiXTwitter as mdiTwitter, mdiXTwitter as mdiTwitterBox"
        allExports.push(
            `export { ${exports.join(', ')} } from './${iconModule}';`,
        );
    }

    const outFile = nodePath.resolve(PACKAGE_DIR, `index.js`);
    await fs.writeFile(outFile, `${allExports.join('\n')}\n`);

    const outDTSFile = nodePath.resolve(PACKAGE_DIR, `index.d.ts`);
    await fs.writeFile(outDTSFile, `${allExports.join('\n')}\n`);

    console.debug('Reformat TS file...');
    await exec(`yarn prettier --write '${GENERATED_DIR}'`);
};
