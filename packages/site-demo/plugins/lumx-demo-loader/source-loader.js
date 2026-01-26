const fs = require('fs/promises');
const path = require('path');

const LOCAL_IMPORT_RX = /@lumx\/demo\/([^'"\s)]+)/g;

async function loadLocalImport({ loader, importPath, isVue }) {
    const baseDir = path.resolve(__dirname, '../../src');

    // Resolve actual file path
    let filePath = path.resolve(baseDir, importPath);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
        filePath = path.join(filePath, isVue ? 'index.vue' : 'index.tsx');
    }

    // Add file as a dependency for webpack watching
    loader.addDependency(filePath);

    // Load images as data URLs, other files as text
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return [`@lumx/demo/${importPath}`, fileContent];
}

/**
 * Async webpack loader that injects source code exports for demo files.
 */
async function sourceLoader(content) {
    this.cacheable?.();
    const callback = this.async();

    try {
        const isVue = this.resourcePath.endsWith('.vue');

        // Build base output
        let output = isVue ? '' : content;
        output += `\nexport const sourceCode = ${JSON.stringify(content.trim())};\n`;

        // Local import entries promises by import path
        const localImportEntriesPromises = new Map();

        // For each lumx demo import
        for (const [, importPath] of content.matchAll(LOCAL_IMPORT_RX)) {
            if (localImportEntriesPromises.has(importPath)) continue;
            // Load local import file content
            localImportEntriesPromises.set(importPath, loadLocalImport({ isVue, loader: this, importPath }));
        }

        const localImportEntries = await Promise.all(localImportEntriesPromises.values());
        const localImports = Object.fromEntries(localImportEntries);

        output += `\nexport const localImports = ${JSON.stringify(localImports)};\n`;

        callback(null, output);
    } catch (err) {
        callback(err);
    }
}

module.exports = sourceLoader;
