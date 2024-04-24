const nodePath = require('node:path');
const fs = require('node:fs/promises');

const sortBy = require('lodash/sortBy');

const aliasesConfig = require('../alias-icons.cjs');
const overrideConfig = require('../override-icons/config.cjs');

const { INPUT_ICON_OVERRIDE_DIR, GENERATED_DIR, JSON_ICON_LIBRARY_FILE } = require('./constants.cjs');
const { svgToPath, optimizeSVGPath } = require('./utils.cjs');

async function loadMDIIconEntries() {
    const entries = [];
    const util = require('@mdi/util');
    for (const { name, path: rawPath } of util.getMeta(true)) {
        const path = optimizeSVGPath(rawPath);
        entries.push({ name, path });
    }
    return entries;
}

async function loadOverrideIconEntries() {
    const entries = [];
    for (const name of Object.keys(overrideConfig)) {
        const iconFile = nodePath.resolve(INPUT_ICON_OVERRIDE_DIR, `${name}.svg`);
        const iconSVGString = String(await fs.readFile(iconFile));
        const path = svgToPath(iconSVGString);
        entries.push({ name, path });
    }
    return entries;
}

/**
 * Generate JSON icon-library
 *
 * 1. Load all MDI icons
 * 2. Load override LumX icons
 * 3. Load alias icons
 * 4. Output to JSON
 */
module.exports = async function generateJSONIconLibrary() {
    console.debug('Generate icon library JSON...');

    // Load MDI icons and our override icons
    const loadIcons = Promise.all([loadOverrideIconEntries(), loadMDIIconEntries()]);

    const replacingIcons = Object.values(overrideConfig).map(({ replace }) => replace).filter(Boolean);

    // Merge icon entries
    const [overrideIcons, mdiIcons] = await loadIcons;

    // MDI icons without the ones we replace + our own icons
    const icons = mdiIcons.filter(({ name }) => !replacingIcons.includes(name)).concat(overrideIcons);

    // Add aliases
    for (const icon of icons) {
        const aliases = aliasesConfig[icon.name];
        if (!aliases) continue;
        icon.aliases = aliases;
    }

    // Serialize to JSON ordered by name
    const json = JSON.stringify({ icons: sortBy(icons, ['name']) }, null, 2);
    await fs.writeFile(nodePath.resolve(GENERATED_DIR, JSON_ICON_LIBRARY_FILE), json);
};
