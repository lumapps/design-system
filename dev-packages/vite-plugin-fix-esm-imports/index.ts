import type { Plugin } from 'vite';

/**
 * Vite plugin for the design system monorepo
 *
 * Fix ESM imports by adding .js extension to lodash sub-module imports.
 * Example: `lodash/get` => `lodash/get.js`
 */
export default function fixEsmImports(): Plugin {
    return {
        name: '@lumx/vite-plugin-fix-esm-imports',
        apply: 'build',
        renderChunk(code) {
            const newCode = code.replace(/from\s+['"](lodash\/[^/'"]+)(?<!\.js)['"]/g, "from '$1.js'");
            if (newCode === code) return null;
            return { code: newCode, map: null };
        },
    };
}
