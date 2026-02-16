import MagicString from 'magic-string';

const LUMX_ICONS_IMPORT = /import\s*\{([^}]+)}\s*from\s*['"]@lumx\/icons['"];?/gm;

/**
 * Rollup plugin to transform @lumx/icons barrel imports to direct ESM imports.
 * This code transform helps some bundler (like esbuild) better tree-shake @lumx/icons.
 *
 * Transforms:
 *   `import { mdiCheck, mdiClose as CloseIcon } from '@lumx/icons';`
 * Into:
 *   `import { mdiCheck } from '@lumx/icons/esm/check';`
 *   `import { mdiClose as CloseIcon } from '@lumx/icons/esm/close';`
 *
 * Note: This plugin only supports named imports. Namespace imports
 * (`import * as icons from '@lumx/icons'`) are not supported.
 *
 * @returns {import('rollup').Plugin} Rollup plugin
 */
export default function optimizeImportsLumxIcons() {
    const validIcons = {};

    /** Convert icon name to kebab-case (mdiCheckCircle -> check-circle) */
    const iconToKebabCase = (iconName) =>
        iconName
            .replace(/^mdi/, '')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();

    /** Parse named imports from matched import groups */
    function parseNamedImports(importGroup) {
        if (!importGroup) return null;

        return importGroup
            .split(',')
            .map((fullImport) => fullImport.trim())
            .filter((fullImport) => fullImport) // Filter out empty strings from trailing commas
            .map((fullImport) => {
                // Extract original icon name (before 'as' if present)
                const imported = fullImport.split(/\s+as\s+/)[0].trim();
                return { imported, fullImport };
            });
    }

    return {
        name: 'rollup-plugin-optimize-imports-lumx-icons',

        async buildStart() {
            // Load icon library
            // eslint-disable-next-line import/no-extraneous-dependencies
            const { default: iconLibrary } = await import('@lumx/icons/override/generated/icon-library.json', {
                with: { type: 'json' },
            });
            // Get all valid icon names
            validIcons.names = new Set(
                iconLibrary.icons.flatMap(({ name, aliases = [] }) => [name, ...(aliases || [])]),
            );
        },

        async transform(code) {
            if (!code.includes('@lumx/icons')) return null;

            // Convert iterator to array to check if there are any matches
            const matches = [...code.matchAll(LUMX_ICONS_IMPORT)];
            if (matches.length === 0) return null;

            const editedCode = new MagicString(code);

            for (const match of matches) {
                const [line, importGroup] = match;
                const namedImports = parseNamedImports(importGroup);
                if (!namedImports?.length) continue;

                const newImports = namedImports
                    .map(({ imported, fullImport }) => {
                        const name = iconToKebabCase(imported);

                        // Validate icon exists
                        if (!validIcons.names.has(name)) {
                            this.error(`Icon "${imported}" not found in @lumx/icons library (expected: "${name}")`);
                        }

                        return `import { ${fullImport} } from '@lumx/icons/esm/${name}.js';`;
                    })
                    .join('\n');

                editedCode.overwrite(match.index, match.index + line.length, newImports);
            }

            return {
                code: editedCode.toString(),
                map: editedCode.generateMap({ hires: true }),
            };
        },
    };
}
