const path = require('path');
const {
    createProject,
    getSourceFile,
    getRootPath,
    findComponentInterface,
    extractPropertiesFromInterface,
    extractDefaultValues,
    getJsDocFromDeclaration,
    getJsDocDeprecatedFromDeclaration,
} = require('./docgen.js');

/**
 * Extract default values for a Vue component.
 * Vue components re-export DEFAULT_PROPS from @lumx/core, so we need to
 * follow the import chain to find the original definition.
 *
 * @param {SourceFile} sourceFile - The Vue component source file
 * @returns {Object} - Map of prop name to default value string
 */
function extractVueDefaultValues(sourceFile) {
    // First try local definition (same as React)
    const localDefaults = extractDefaultValues(sourceFile);
    if (Object.keys(localDefaults).length > 0) {
        return localDefaults;
    }

    // Follow re-exported DEFAULT_PROPS to its original source
    for (const importDecl of sourceFile.getImportDeclarations()) {
        const namedImports = importDecl.getNamedImports();
        const defaultPropsImport = namedImports.find((ni) => {
            // Handle both `import { DEFAULT_PROPS }` and `import { X as DEFAULT_PROPS }`
            const name = ni.getAliasNode()?.getText() || ni.getName();
            return name === 'DEFAULT_PROPS';
        });

        if (defaultPropsImport) {
            const resolvedModule = importDecl.getModuleSpecifierSourceFile();
            if (resolvedModule) {
                return extractDefaultValues(resolvedModule);
            }
        }
    }

    return {};
}

/**
 * Get the Vue component name from defineComponent options.
 * Looks for the `name` property in the second argument of defineComponent().
 *
 * @param {SourceFile} sourceFile - The Vue component source file
 * @returns {string} - The component display name
 */
function getVueComponentName(sourceFile) {
    const baseName = path.basename(sourceFile.getFilePath(), '.tsx');

    for (const varDecl of sourceFile.getVariableDeclarations()) {
        const initializer = varDecl.getInitializer();
        if (!initializer || initializer.getKindName() !== 'CallExpression') continue;

        if (initializer.getExpression().getText() !== 'defineComponent') continue;

        // Get the options object (second argument of defineComponent)
        const args = initializer.getArguments();
        if (args.length < 2) continue;

        const optionsArg = args[1];
        if (optionsArg.getKindName() !== 'ObjectLiteralExpression') continue;

        for (const prop of optionsArg.getProperties()) {
            if (prop.getKindName() === 'PropertyAssignment' && prop.getName() === 'name') {
                const value = prop.getInitializer()?.getText();
                if (value) {
                    return value.replace(/^['"]|['"]$/g, '');
                }
            }
        }
    }

    return baseName;
}

/**
 * Parse a JSDoc block from a node's leading comment trivia.
 *
 * Used for object-property declarations (e.g. `emitSchema.change`) where TS-morph's
 * `getJsDocs()` returns nothing — JSDoc parsing in the TS compiler is opt-in for
 * `JSDocableNode` declarations only.
 *
 * @param {Node} node - The AST node whose leading comments to inspect
 * @returns {string} - The first JSDoc block's description text, or '' if none.
 */
function extractJsDocFromLeadingComments(node) {
    const ranges = node.getLeadingCommentRanges?.() || [];
    for (const range of ranges) {
        const text = range.getText();
        if (!text.startsWith('/**')) continue;
        // Strip the `/**`, `*/`, and per-line ` * ` markers, ignoring `@tag` lines.
        const inner = text
            .replace(/^\/\*\*/, '')
            .replace(/\*\/$/, '')
            .split('\n')
            .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
            .filter((line) => !line.startsWith('@'))
            .join('\n')
            .trim();
        if (inner) return inner;
    }
    return '';
}

/**
 * Extract events from a Vue component.
 * Supports two patterns:
 *   1. `emitSchema` const objects with validator functions
 *   2. Inline `emits: ['eventName']` arrays in defineComponent options
 *
 * @param {SourceFile} sourceFile - The Vue component source file
 * @returns {Array<{name: string, description: string, parameters: Array<{name: string, type: string, optional: boolean}>}>}
 */
function extractEmits(sourceFile) {
    const events = [];

    // Strategy 1: Look for exported emitSchema const
    for (const varDecl of sourceFile.getVariableDeclarations()) {
        if (varDecl.getName() !== 'emitSchema') continue;

        const initializer = varDecl.getInitializer();
        if (!initializer || initializer.getKindName() !== 'ObjectLiteralExpression') continue;

        for (const prop of initializer.getProperties()) {
            if (prop.getKindName() !== 'PropertyAssignment') continue;

            // Strip surrounding quotes for string-literal property names (e.g. `'load-more'`).
            const eventName = prop.getName().replace(/^['"]|['"]$/g, '');
            // PropertyAssignment doesn't expose JSDoc via `getJsDocs()` — fall back to
            // parsing leading comment trivia.
            const description = getJsDocFromDeclaration(prop) || extractJsDocFromLeadingComments(prop);
            const parameters = [];

            // Parse the validator function's parameters for type info
            const validator = prop.getInitializer();
            if (validator && validator.getKindName() === 'ArrowFunction') {
                for (const param of validator.getParameters()) {
                    // Strip the leading underscore convention (`_event` → `event`) — used
                    // when the validator can't actually validate (e.g. `unknown` payloads).
                    const paramName = param.getName().replace(/^_/, '');
                    const paramType = param.getTypeNode()?.getText() || param.getType().getText();
                    const optional = param.hasQuestionToken() || param.hasInitializer();
                    parameters.push({ name: paramName, type: paramType, optional });
                }
            }

            events.push({ name: eventName, description, parameters });
        }

        // Found emitSchema, use it
        return events;
    }

    // Strategy 2: Look for inline emits array in defineComponent options
    for (const varDecl of sourceFile.getVariableDeclarations()) {
        const initializer = varDecl.getInitializer();
        if (!initializer || initializer.getKindName() !== 'CallExpression') continue;

        if (initializer.getExpression().getText() !== 'defineComponent') continue;

        const args = initializer.getArguments();
        if (args.length < 2) continue;

        const optionsArg = args[1];
        if (optionsArg.getKindName() !== 'ObjectLiteralExpression') continue;

        for (const prop of optionsArg.getProperties()) {
            if (prop.getKindName() !== 'PropertyAssignment' || prop.getName() !== 'emits') continue;

            const emitsValue = prop.getInitializer();
            if (!emitsValue || emitsValue.getKindName() !== 'ArrayLiteralExpression') continue;

            for (const element of emitsValue.getElements()) {
                const eventName = element.getText().replace(/^['"]|['"]$/g, '');
                events.push({ name: eventName, description: '', parameters: [] });
            }
        }
    }

    return events;
}

/**
 * Extract slots from a Vue component.
 * Detects usage of `slots.<name>` patterns in the component source.
 *
 * @param {SourceFile} sourceFile - The Vue component source file
 * @returns {Array<{name: string}>}
 */
function extractSlots(sourceFile) {
    const slots = [];
    const text = sourceFile.getFullText();
    const seen = new Set();

    for (const match of text.matchAll(/\bslots\.(\w+)\b/g)) {
        const name = match[1];
        if (!seen.has(name)) {
            seen.add(name);
            slots.push({ name });
        }
    }

    return slots;
}

/**
 * Get the @deprecated JSDoc tag from a Vue component's defineComponent variable declaration.
 * @param {SourceFile} sourceFile - The source file
 * @returns {string|undefined} - The deprecation reason, or undefined if not deprecated
 */
function getVueComponentDeprecated(sourceFile) {
    for (const varDecl of sourceFile.getVariableDeclarations()) {
        const initializer = varDecl.getInitializer();
        if (!initializer || initializer.getKindName() !== 'CallExpression') continue;
        if (initializer.getExpression().getText() !== 'defineComponent') continue;

        // JSDoc is on the VariableStatement (parent of VariableDeclarationList)
        const varStatement = varDecl.getParent()?.getParent();
        const result = getJsDocDeprecatedFromDeclaration(varStatement);
        if (result !== undefined) return result;
    }
    return undefined;
}

/**
 * Parse a Vue component file and extract props, events, and slots.
 *
 * @param {Project} project - The ts-morph project
 * @param {string} filePath - Path to the Vue component file
 * @returns {Object|null} - Component documentation or null if parsing fails
 */
function parseVueComponent(project, filePath) {
    const sourceFile = getSourceFile(project, filePath);
    if (!sourceFile) {
        return null;
    }

    const interfaceDecl = findComponentInterface(sourceFile, project);
    if (!interfaceDecl) {
        return null;
    }

    const rootPath = getRootPath(project);
    const defaultValues = extractVueDefaultValues(sourceFile);
    const props = extractPropertiesFromInterface(interfaceDecl, sourceFile, rootPath, defaultValues);
    const displayName = getVueComponentName(sourceFile);
    const events = extractEmits(sourceFile);
    const slots = extractSlots(sourceFile);
    const deprecated = getVueComponentDeprecated(sourceFile);

    const result = { displayName, props, events, slots };
    if (deprecated !== undefined) {
        result.deprecated = deprecated;
    }
    return result;
}

exports.createProject = createProject;
exports.parseVueComponent = parseVueComponent;

/**
 * CLI entrypoint - run docgen for a single Vue component
 * Usage: node vue-docgen.js <component-path>
 * Example: node vue-docgen.js packages/lumx-vue/src/components/button/Button.tsx
 */
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage: node vue-docgen.js <component-path>');
        console.error('Example: node vue-docgen.js packages/lumx-vue/src/components/button/Button.tsx');
        process.exit(1);
    }

    const componentPath = args[0];
    const lumxVuePath = path.resolve(__dirname, '../../../../packages/lumx-vue');

    try {
        const project = createProject(lumxVuePath);
        const result = parseVueComponent(project, path.resolve(componentPath));

        if (!result) {
            console.error('Error: Could not extract docs from Vue component');
            process.exit(1);
        }

        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}
