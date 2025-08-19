#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs/promises');

const { formatMdiName } = require('./override/generate/utils.cjs');
const { GENERATED_DIR, JSON_ICON_LIBRARY_FILE, DIST_PATH, PKG_PATH } = require('./override/generate/constants.cjs');

/**
 * Generate JS icons
 *
 * 1. Load JSON icon library
 * 2. Output icons and alias icons to a JS CJS & ESM files
 */
async function buildJSFiles() {
    console.debug('Generating JS files...');
    const distEsmPath = path.join(DIST_PATH, 'esm');
    const distCjsPath = path.join(DIST_PATH, 'cjs');
    const createDistPromise = [fs.mkdir(distEsmPath, { recursive: true }), fs.mkdir(distCjsPath, { recursive: true })];

    const { icons } = JSON.parse(await fs.readFile(path.resolve(GENERATED_DIR, JSON_ICON_LIBRARY_FILE)));

    // Create CJS and ESM dirs
    await Promise.all(createDistPromise);

    const esmIndexExports = [];
    const cjsExports = [];
    const dtsDeclarations = [];
    const promises = [];

    for (const { name, path: iconPath, aliases = [] } of icons) {
        const formattedName = formatMdiName(name);
        const kebabName = name;

        // ESM: Create individual icon files
        promises.push(
            fs.writeFile(path.join(distEsmPath, `${kebabName}.js`), `export const ${formattedName} = '${iconPath}';`),
        );

        // CJS: Add export to the list
        cjsExports.push(`exports.${formattedName} = '${iconPath}';`);

        // Add to ESM index exports
        esmIndexExports.push(`export * from './${kebabName}.js';`);

        // Add type declaration to the list
        dtsDeclarations.push(`export declare const ${formattedName}: string;`);

        // Handle aliases
        for (const alias of aliases) {
            const formattedAlias = formatMdiName(alias);

            // CJS alias
            cjsExports.push(`exports.${formattedAlias} = exports.${formattedName};`);

            // ESM alias
            esmIndexExports.push(`export { ${formattedName} as ${formattedAlias} } from './${kebabName}.js';`);

            // Add alias type declaration to the list
            dtsDeclarations.push(`export { ${formattedName} as ${formattedAlias} };`);
        }
    }

    // Write ESM index file
    promises.push(fs.writeFile(path.join(distEsmPath, 'index.js'), esmIndexExports.join('\n')));

    // Write main index.js and the single index.d.ts
    promises.push(fs.writeFile(path.join(DIST_PATH, 'index.js'), `export * from './esm/index.js';`));
    promises.push(fs.writeFile(path.join(DIST_PATH, 'index.d.ts'), dtsDeclarations.join('\n')));

    // Write CJS index file with all exports
    promises.push(fs.writeFile(path.join(distCjsPath, 'index.js'), cjsExports.join('\n')));

    await Promise.all(promises);
}

async function copyFiles() {
    console.debug('Copying files to dist...');
    const filesToCopy = [
        'package.json',
        'README.md',
        'README-v4-to-v5-migration.md',
        'font.scss',
        'override/generated/',
    ];

    const promises = [];
    for (const file of filesToCopy) {
        const src = path.join(PKG_PATH, file);
        const dest = path.join(DIST_PATH, file);
        promises.push(fs.cp(src, dest, { recursive: true }));
    }

    await Promise.all(promises);
}

(async () => {
    // Clean dist dir
    await fs.rm(DIST_PATH, { recursive: true, force: true });

    const buildJSPromise = buildJSFiles();
    const copyFilePromise = copyFiles();

    await Promise.all([buildJSPromise, copyFilePromise]);
})();
