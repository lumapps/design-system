/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/**
 * Shared Rollup/Vite plugins for the design system monorepo
 */

/**
 * Fix ESM imports by adding proper .js extensions and /index.js for directory imports.
 * This ensures compatibility with strict ESM resolution in modern bundlers.
 */
export default function fixEsmImports() {
    return {
        name: 'rollup-plugin-lumx-fix-esm-imports',
        generateBundle(_, bundle) {
            for (const fileName in bundle) {
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk') {
                    // 1. Fix shallow directory imports for @lumx/core (1-2 levels deep)
                    // Examples: @lumx/core/js/constants, @lumx/core/js/utils/disabledState
                    // Pattern: matches paths with at most 2 segments (i.e., 0 or 1 slashes) after @lumx/core/js/
                    chunk.code = chunk.code.replace(
                        /from\s+['"](@lumx\/core\/js\/[^/'"]+(?:\/[^/'"]+)?)(?<!\.js)['"]/g,
                        "from '$1/index.js'",
                    );

                    // 2. Fix other extensionless imports (icons, deep core paths, or relative files)
                    // This catches deeper paths (3+ segments) and adds .js instead of /index.js
                    // Examples: @lumx/core/js/utils/selectors/getWithSelector, @lumx/icons/esm/alert
                    chunk.code = chunk.code.replace(
                        /from\s+['"]((?:@lumx\/(?:icons\/esm\/|core\/js\/)|\.).*?)(?<!\.js)['"]/g,
                        "from '$1.js'",
                    );
                }
            }
        },
    };
};
