const path = require('path');
const fs = require('fs/promises');

const overrideConfig = require('../override-icons/config');
const { GENERATED_DIR, OUT_OVERRIDE_NAME } = require('./constants.cjs');

/**
 * Generate SCSS exporting the override icons.
 */
async function generateSCSSOverride() {
    console.debug('Generate SCSS class overrides...');

    const classDefinitions = [];
    for (const [name, { cssCode }] of Object.entries(overrideConfig)) {
        // Override mdi class with the given css code character point
        classDefinitions.push(`.mdi-${name}:before {\n    content: '${cssCode}';\n}`);
    }

    const scssOverrideFile = path.resolve(GENERATED_DIR, `${OUT_OVERRIDE_NAME}.scss`);
    await fs.writeFile(scssOverrideFile, `${classDefinitions.join('\n\n')}\n`);
}

module.exports = generateSCSSOverride;
