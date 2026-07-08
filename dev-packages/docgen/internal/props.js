const path = require('path');
const { getTypeText } = require('./type-text.js');
const { getJsDocDescription, getJsDocDeprecated, isJsDocInternal, getJsDocAlias } = require('./jsdoc.js');

/**
 * Get the declarations for a property to track inheritance
 * @param {Symbol} prop - The property symbol
 * @param {string} rootPath - The project root path for relative file names
 */
function getDeclarations(prop, rootPath) {
    const declarations = [];

    for (const decl of prop.getDeclarations()) {
        const declFile = decl.getSourceFile();
        if (!declFile) continue;

        // Find the containing interface or type alias
        let parent = decl.getParent();
        while (parent) {
            const kind = parent.getKindName();
            if (kind === 'InterfaceDeclaration' || kind === 'TypeAliasDeclaration') {
                declarations.push({
                    fileName: path.relative(rootPath, declFile.getFilePath()),
                    name: parent.getName(),
                });
                break;
            }
            parent = parent.getParent?.() ?? null;
        }
    }

    return declarations;
}

/**
 * Extract default values from the component file
 */
function extractDefaultValues(sourceFile) {
    const defaults = {};

    /** Try to extract from a given source file. Returns true if DEFAULT_PROPS was found. */
    function tryExtract(file) {
        for (const varDecl of file.getVariableDeclarations()) {
            if (varDecl.getName() !== 'DEFAULT_PROPS') continue;

            let initializer = varDecl.getInitializer();
            if (!initializer) continue;

            // Handle `as const` — unwrap AsExpression to get the ObjectLiteralExpression inside.
            if (initializer.getKindName() === 'AsExpression') {
                initializer = initializer.getExpression();
            }

            if (initializer.getKindName() !== 'ObjectLiteralExpression') continue;

            for (const prop of initializer.getProperties()) {
                if (prop.getKindName() === 'PropertyAssignment') {
                    const name = prop.getName();
                    const value = prop.getInitializer()?.getText();
                    if (name && value) {
                        defaults[name] = value.replace(/^["']|["']$/g, '');
                    }
                }
            }
            return true;
        }
        return false;
    }

    // First try the current file.
    if (tryExtract(sourceFile)) return defaults;

    // Follow re-exported DEFAULT_PROPS to its original source (e.g. from @lumx/core).
    for (const importDecl of sourceFile.getImportDeclarations()) {
        const namedImports = importDecl.getNamedImports();
        const hasDefaultProps = namedImports.some((ni) => {
            const name = ni.getAliasNode()?.getText() || ni.getName();
            return name === 'DEFAULT_PROPS';
        });
        if (!hasDefaultProps) continue;

        const resolvedModule = importDecl.getModuleSpecifierSourceFile();
        if (resolvedModule && resolvedModule !== sourceFile) {
            tryExtract(resolvedModule);
            if (Object.keys(defaults).length > 0) break;
        }
    }

    return defaults;
}

/**
 * Collect all property symbols from a type, resolving Omit/Pick/Partial/Required utility types
 * that ts-morph would otherwise return 0 properties for.
 * Returns a Map of prop name -> symbol.
 *
 * @param {Type} t - The TypeScript type to collect properties from
 * @returns {Map<string, Symbol>} - Map of prop name to symbol
 */
function collectPropsFromType(t) {
    const propMap = new Map();

    if (t.isIntersection()) {
        for (const part of t.getIntersectionTypes()) {
            for (const [name, sym] of collectPropsFromType(part)) {
                if (!propMap.has(name)) propMap.set(name, sym);
            }
        }
        return propMap;
    }

    // Resolve Omit<Base, Keys> — ts-morph often returns 0 properties for these
    const aliasName = t.getAliasSymbol()?.getName();
    const aliasArgs = t.getAliasTypeArguments();

    if (aliasName === 'Omit' && aliasArgs.length >= 2) {
        const baseType = aliasArgs[0];
        const keysType = aliasArgs[1];
        const excludedKeys = new Set();
        const keyTypes = keysType.isUnion() ? keysType.getUnionTypes() : [keysType];
        for (const k of keyTypes) {
            if (k.isStringLiteral()) excludedKeys.add(k.getLiteralValue());
        }
        for (const sym of baseType.getProperties()) {
            if (!excludedKeys.has(sym.getName())) propMap.set(sym.getName(), sym);
        }
        return propMap;
    }

    if (aliasName === 'Pick' && aliasArgs.length >= 2) {
        const baseType = aliasArgs[0];
        const keysType = aliasArgs[1];
        const includedKeys = new Set();
        const keyTypes = keysType.isUnion() ? keysType.getUnionTypes() : [keysType];
        for (const k of keyTypes) {
            if (k.isStringLiteral()) includedKeys.add(k.getLiteralValue());
        }
        for (const sym of baseType.getProperties()) {
            if (includedKeys.has(sym.getName())) propMap.set(sym.getName(), sym);
        }
        return propMap;
    }

    if ((aliasName === 'Partial' || aliasName === 'Required') && aliasArgs.length >= 1) {
        for (const sym of aliasArgs[0].getProperties()) {
            propMap.set(sym.getName(), sym);
        }
        return propMap;
    }

    // Normal: direct properties
    for (const sym of t.getProperties()) {
        propMap.set(sym.getName(), sym);
    }
    return propMap;
}

/**
 * Build a prop info object, omitting `required`/`deprecated` when false and
 * `defaultValue` when null so the generated JSON stays compact.
 *
 * @param {Object} fields
 * @param {string} fields.name
 * @param {string} fields.description
 * @param {boolean} fields.required
 * @param {boolean} fields.deprecated
 * @param {*} fields.type
 * @param {Object[]} fields.declarations
 * @param {string|null} fields.defaultValue
 * @returns {Object} - The prop info object
 */
function buildPropInfo({ name, description, required, deprecated, type, declarations, defaultValue }) {
    const info = { name, description };
    if (required) info.required = true;
    if (deprecated) info.deprecated = true;
    info.type = type;
    info.declarations = declarations;
    if (defaultValue !== null) info.defaultValue = defaultValue;
    return info;
}

/**
 * Convert a property symbol to a prop info object.
 *
 * @param {Symbol} prop - The property symbol
 * @param {SourceFile} sourceFile - The source file (for type resolution location)
 * @param {string} rootPath - The project root path for relative file names
 * @param {Object} defaultValues - Default values map (prop name -> default value string)
 * @returns {Object} - The prop info object
 */
function propSymbolToInfo(prop, sourceFile, rootPath, defaultValues) {
    const name = prop.getName();
    const valueDecl = prop.getValueDeclaration();
    const propType = prop.getTypeAtLocation(sourceFile);
    const optional = prop.isOptional();
    const defaultValue = defaultValues[name] || null;
    const deprecatedReason = getJsDocDeprecated(prop);
    const deprecated = deprecatedReason !== undefined;

    let description = getJsDocDescription(prop);
    if (deprecated && deprecatedReason) {
        const deprecatedText = `@deprecated ${deprecatedReason}`;
        description = description ? `${description}\n${deprecatedText}` : deprecatedText;
    }

    return buildPropInfo({
        name,
        description,
        required: !optional,
        deprecated,
        type: getTypeText(propType, valueDecl, sourceFile),
        declarations: getDeclarations(prop, rootPath),
        defaultValue,
    });
}

/**
 * Extract properties from an interface including inherited ones
 * @param {InterfaceDeclaration|TypeAliasDeclaration} interfaceDecl
 * @param {SourceFile} sourceFile
 * @param {string} rootPath - The project root path for relative file names
 * @param {Object} [defaultValues] - Default values map (prop name -> default value string)
 * @param {Map<string,Symbol>} [propMap] - Optional pre-collected prop map (skips re-collection if provided)
 */
function extractPropertiesFromInterface(interfaceDecl, sourceFile, rootPath, defaultValues = {}, propMap = null) {
    const properties = [];
    const seenProps = new Set();
    // Track alias relationships: alias prop name -> target prop name
    const aliasMap = new Map();

    // Get all properties — use provided map or collect from interface type
    const typeProperties = propMap ? [...propMap.values()] : interfaceDecl.getType().getProperties();

    for (const prop of typeProperties) {
        const name = prop.getName();

        // Skip duplicates
        if (seenProps.has(name)) continue;
        seenProps.add(name);

        // Skip @internal props (framework-internal, not part of the public API)
        if (isJsDocInternal(prop)) continue;

        // Check for @alias tag
        const aliasTarget = getJsDocAlias(prop);
        if (aliasTarget) {
            aliasMap.set(name, aliasTarget);
            continue;
        }

        properties.push(propSymbolToInfo(prop, sourceFile, rootPath, defaultValues));
    }

    // Merge aliases into their target properties
    for (const [aliasName, targetName] of aliasMap) {
        const targetProp = properties.find((p) => p.name === targetName);
        if (targetProp) {
            if (!targetProp.aliases) targetProp.aliases = [];
            targetProp.aliases.push(aliasName);
        }
    }

    return properties;
}

exports.buildPropInfo = buildPropInfo;
exports.getDeclarations = getDeclarations;
exports.extractDefaultValues = extractDefaultValues;
exports.collectPropsFromType = collectPropsFromType;
exports.propSymbolToInfo = propSymbolToInfo;
exports.extractPropertiesFromInterface = extractPropertiesFromInterface;
