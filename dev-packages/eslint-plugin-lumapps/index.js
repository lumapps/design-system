/* eslint-disable no-var */

/** Convert icon name to kebab-case filename */
function iconNameToPath(iconName) {
    return iconName
        .replace(/^mdi/, '') // Remove 'mdi' prefix
        .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
        .toLowerCase();
}

module.exports = {
    rules: {
        'do-not-import-all-lodash': {
            docs: {
                description: 'Do not import all lodash',
                category: 'Best Practices',
                recommended: true,
            },
            create(context) {
                return {
                    ImportDeclaration(node) {
                        var sourceCode = context.getSourceCode();
                        var regexp = /.* 'lodash';/gm;
                        var line = sourceCode.getText(node);

                        if (regexp.exec(line) !== null) {
                            context.report(
                                node,
                                'Do not import all the function from lodash, since this has a heavy impact on performance. Please import each function using import <function> from lodash/<function>',
                            );
                        }
                    },
                };
            },
        },
        'prefer-direct-icon-import': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Prefer direct ESM imports from @lumx/icons/esm/<icon>',
                    category: 'Best Practices',
                    recommended: true,
                },
                fixable: 'code',
                messages: {
                    preferDirectImport:
                        'Import icons directly from @lumx/icons/esm/<icon> instead of the barrel export for better performance and smaller bundle size.',
                },
            },
            create(context) {
                return {
                    ImportDeclaration(node) {
                        const source = node.source.value;

                        // Only check imports from '@lumx/icons' (not from '@lumx/icons/esm/...')
                        if (source !== '@lumx/icons') {
                            return;
                        }

                        // Only check named imports (not default or namespace imports)
                        const namedImports = node.specifiers.filter((spec) => spec.type === 'ImportSpecifier');

                        if (namedImports.length === 0) {
                            return;
                        }

                        context.report({
                            node,
                            messageId: 'preferDirectImport',
                            fix(fixer) {
                                // Generate individual import statements for each icon
                                const imports = namedImports.map((spec) => {
                                    const importedName = spec.imported.name;
                                    const localName = spec.local.name;
                                    const iconName = iconNameToPath(importedName);
                                    const importPath = `@lumx/icons/esm/${iconName}`;

                                    // Handle renamed imports: import { mdiCheck as checkIcon }
                                    if (importedName !== localName) {
                                        return `import { ${importedName} as ${localName} } from '${importPath}';`;
                                    }

                                    return `import { ${importedName} } from '${importPath}';`;
                                });

                                return fixer.replaceText(node, imports.join('\n'));
                            },
                        });
                    },
                };
            },
        },
    },
};
