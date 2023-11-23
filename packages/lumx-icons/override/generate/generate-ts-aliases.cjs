const camelCase = require('lodash/camelCase');
const path = require('path');
const fs = require('fs/promises');
const aliasesConfig = require('../alias-icons');
const { OUT_OVERRIDE_NAME, GENERATED_DIR, OUT_ALIASES_NAME } = require('./constants.cjs');

/**
 * Generate TS icon aliases
 *
 * 1. List the aliases in our config file
 * 2. Generate TS const exports for each
 * 3. Write to SCSS file
 */
async function generateTSAliases() {
    const iconImportNames = [];
    const iconExports = [];

    for (const [name, aliases] of Object.entries(aliasesConfig)) {
        const jsIconName = camelCase(`mdi-${name}`);
        // Icon name to import before re-exporting as alias
        iconImportNames.push(jsIconName);

        for (const alias of aliases) {
            const jsIconAlias = camelCase(`mdi-${alias}`);
            // Icon alias
            iconExports.push(`export const ${jsIconAlias} = ${jsIconName};`);
        }

        /*
         * For an icon named `foo` with aliases: `bar` & `baz`.
         * We generate:
         *
         * export const mdiBar = mdiFoo;
         *
         * export const mdiBaz = mdiFoo;
         */
    }

    // Sort icon import names
    iconImportNames.sort();

    // Output TS file
    const lines = [
        // Import icons to alias
        `import {\n    ${iconImportNames.join(',\n    ')},\n} from './${OUT_OVERRIDE_NAME}';`,
        // Re-export overridden icons (we want to alias AFTER we override icons)
        `export * from './${OUT_OVERRIDE_NAME}';`,
        // Export icon aliases
        ...iconExports,
    ];
    const outTSFile = path.resolve(GENERATED_DIR, `${OUT_ALIASES_NAME}.ts`);
    await fs.writeFile(outTSFile, `${lines.join('\n\n')}\n`);
}

module.exports = generateTSAliases;
