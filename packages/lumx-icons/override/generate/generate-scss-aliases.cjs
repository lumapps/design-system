const path = require('path');
const fs = require('fs/promises');
const aliasesConfig = require('../alias-icons');
const { GENERATED_DIR, OUT_ALIASES_NAME } = require('./constants.cjs');

/**
 * Generate SCSS aliases for mdi icons
 *
 * 1. List the aliases in our config file
 * 2. Generate SCSS alias classes with @extend
 * 3. Write to SCSS file
 */
async function generateSCSSAliases() {
    console.debug('Generate SCSS class aliases...');

    const classDefinitions = [];

    // For each icon alias in the configuration
    for (const [name, aliases] of Object.entries(aliasesConfig)) {
        // SCSS alias class selectors (ex: `.mdi-bar, \n.mdi-baz`)
        const selectors = aliases.map((alias) => `.mdi-${alias}`).join(',\n');
        // SCSS class definition
        classDefinitions.push(`${selectors} {\n    @extend .mdi-${name};\n}`);
        /*
         * For an icon named `foo` with aliases: `bar` & `baz`.
         * We generate:
         *
         * .mdi-bar,
         * .mdi-baz {
         *     @extend .mdi-foo;
         * }
         */
    }

    // Output SCSS file
    const outSCSSFile = path.resolve(GENERATED_DIR, `${OUT_ALIASES_NAME}.scss`);
    await fs.writeFile(outSCSSFile, `${classDefinitions.join('\n\n')}\n`);
}

module.exports = generateSCSSAliases;
