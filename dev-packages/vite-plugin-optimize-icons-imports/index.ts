import MagicString from 'magic-string';
import type { Plugin } from 'vite';

const LUMX_ICONS_IMPORT = /import\s*\{([^}]+)}\s*from\s*['"]@lumx\/icons['"];?/gm;

interface NamedImport {
    imported: string;
    fullImport: string;
}

/**
 * Vite plugin to transform @lumx/icons barrel imports to direct ESM imports.
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
 */
export default function optimizeImportsLumxIcons(): Plugin {
    let validIconNames: Set<string> | undefined;

    /** Convert icon name to kebab-case (mdiCheckCircle -> check-circle) */
    const iconToKebabCase = (iconName: string): string =>
        iconName
            .replace(/^mdi/, '')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();

    /** Parse named imports from matched import groups */
    function parseNamedImports(importGroup: string | undefined): NamedImport[] | null {
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
        name: '@lumx/vite-plugin-optimize-icons-imports',
        apply: 'build',

        async buildStart() {
            // Load icon library
            // eslint-disable-next-line import/no-extraneous-dependencies
            const { default: iconLibrary } = await import('@lumx/icons/override/generated/icon-library.json', {
                with: { type: 'json' },
            });
            // Get all valid icon names
            validIconNames = new Set(
                iconLibrary.icons.flatMap(({ name, aliases = [] }: { name: string; aliases?: string[] }) => [
                    name,
                    ...(aliases || []),
                ]),
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
                        if (!validIconNames?.has(name)) {
                            this.error(`Icon "${imported}" not found in @lumx/icons library (expected: "${name}")`);
                        }

                        return `import { ${fullImport} } from '@lumx/icons/esm/${name}.js';`;
                    })
                    .join('\n');

                editedCode.overwrite(match.index!, match.index! + line.length, newImports);
            }

            return {
                code: editedCode.toString(),
                map: editedCode.generateMap({ hires: true }),
            };
        },
    };
}
