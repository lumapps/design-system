import MagicString from 'magic-string';

const LUMX_ICONS_IMPORT = /import\s*\{\s*([^}]+)\s*}\s*from\s*['"]@lumx\/icons['"];?/;

/** Convert icon name to kebab-case (mdiCheckCircle -> check-circle) */
function iconToKebabCase(iconName) {
    return iconName
        .replace(/^mdi/, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

/** Parse named imports from @lumx/icons statement */
function parseNamedImports(importStatement) {
    const match = importStatement.match(LUMX_ICONS_IMPORT);
    if (!match) return null;

    return match[1].split(',').map((item) => {
        const [imported, local = imported] = item.split(' as ').map((s) => s.trim());
        return { imported, local };
    });
}

/**
 * Rollup plugin to transform @lumx/icons barrel imports to direct ESM imports
 *
 * @returns {import('rollup').Plugin} Rollup plugin
 */
export default function optimizeImportsLumxIcons() {
    return {
        name: 'rollup-plugin-optimize-imports-lumx-icons',
        transform(code) {
            if (!code.includes('@lumx/icons')) return null;

            const matches = [...code.matchAll(new RegExp(LUMX_ICONS_IMPORT, 'g'))];
            if (matches.length === 0) return null;

            const editedCode = new MagicString(code);

            for (const match of matches) {
                const namedImports = parseNamedImports(match[0]);
                if (!namedImports?.length) continue;

                const newImports = namedImports
                    .map(({ imported, local }) => {
                        const path = `@lumx/icons/esm/${iconToKebabCase(imported)}`;
                        const alias = imported !== local ? ` as ${local}` : '';
                        return `import { ${imported}${alias} } from '${path}';`;
                    })
                    .join('\n');

                editedCode.overwrite(match.index, match.index + match[0].length, newImports);
            }

            return {
                code: editedCode.toString(),
                map: editedCode.generateMap({ hires: true }),
            };
        },
    };
}
