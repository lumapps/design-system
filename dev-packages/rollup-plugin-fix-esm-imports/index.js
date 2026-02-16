/**
 * Shared Rollup/Vite plugins for the design system monorepo
 *
 * Fix ESM imports by adding .js extension to lodash sub-module imports.
 * Example: `lodash/get` => `lodash/get.js`
 */
export default function fixEsmImports() {
    return {
        name: 'rollup-plugin-lumx-fix-esm-imports',
        generateBundle(_, bundle) {
            for (const fileName in bundle) {
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk') {
                    chunk.code = chunk.code.replace(/from\s+['"](lodash\/[^/'"]+)(?<!\.js)['"]/g, "from '$1.js'");
                }
            }
        },
    };
}
