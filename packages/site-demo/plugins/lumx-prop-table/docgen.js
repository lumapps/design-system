const path = require('path');
const { Project } = require('ts-morph');

/**
 * Initialize and return the ts-morph project for parsing component files.
 */
function createProject(projectPath) {
    return new Project({ tsConfigFilePath: path.join(projectPath, 'tsconfig.json') });
}

/**
 * Get a clean fully qualified name from a symbol.
 * Handles path-based FQNs and extracts just the type name.
 */
function getCleanFQN(symbol) {
    if (!symbol) return null;

    let fqn = symbol.getFullyQualifiedName();

    // Handle path-based FQNs like "/path/to/file".TypeName
    if (fqn.includes('/')) {
        const match = fqn.match(/\.([^."]+)$/);
        return match ? match[1] : fqn.split('.').pop().replace(/"/g, '');
    }

    // Skip internal names like __type.bivarianceHack
    if (fqn.startsWith('__')) {
        return null;
    }

    return fqn;
}

/**
 * Get a clean type name from a type node using symbol APIs.
 * This uses the AST (what was written) rather than the resolved type.
 * Returns null for types that should be filtered (null, undefined).
 * For union type nodes, returns an array of type names.
 */
function getTypeNameFromNode(typeNode) {
    if (!typeNode) return null;

    const kind = typeNode.getKindName();
    const type = typeNode.getType();

    // Handle keywords
    if (kind === 'StringKeyword') return 'string';
    if (kind === 'NumberKeyword') return 'number';
    if (kind === 'BooleanKeyword') return 'boolean';
    if (kind === 'UndefinedKeyword' || kind === 'NullKeyword') return null;

    // Handle literal types
    if (kind === 'LiteralType') {
        const literal = typeNode.getLiteral?.();
        if (literal) {
            const literalKind = literal.getKindName();
            if (literalKind === 'StringLiteral') return JSON.stringify(literal.getLiteralValue());
            if (literalKind === 'NumericLiteral') return literal.getLiteralValue();
            if (literalKind === 'TrueKeyword') return true;
            if (literalKind === 'FalseKeyword') return false;
        }
        return typeNode.getText();
    }

    // Handle union type nodes - return array of type names
    if (kind === 'UnionType') {
        const names = [];
        for (const child of typeNode.getTypeNodes()) {
            const name = getTypeNameFromNode(child);
            if (name !== null) names.push(name);
        }
        return names.length > 0 ? names : null;
    }

    // Handle type references (named types like React.Ref<T>)
    if (kind === 'TypeReference') {
        const symbol = type.getAliasSymbol() || type.getSymbol();
        const fqn = getCleanFQN(symbol);

        if (fqn) {
            // Append explicit type arguments if present in the written code
            const typeArgs = typeNode.getTypeArguments?.();
            if (typeArgs && typeArgs.length > 0) {
                const argTexts = typeArgs.map((a) => a.getText());
                return `${fqn}<${argTexts.join(', ')}>`;
            }
            return fqn;
        }
    }

    // Fallback to node text for other types (function types, etc.)
    return typeNode.getText();
}

/**
 * Extract literal values from union types for display.
 * Returns an array of formatted values, collapsing boolean literals to 'boolean'.
 */
function extractUnionLiteralValues(unionTypes, sourceFile) {
    const values = [];
    let hasBoolean = false;

    for (const t of unionTypes) {
        if (t.isUndefined() || t.isNull()) continue;

        if (t.isBooleanLiteral()) {
            // Collapse true/false to 'boolean'
            if (!hasBoolean) {
                values.push('boolean');
                hasBoolean = true;
            }
        } else if (t.isLiteral()) {
            const literalValue = t.getLiteralValue();
            // Wrap strings in quotes for display, keep numbers/booleans as-is
            values.push(typeof literalValue === 'string' ? JSON.stringify(literalValue) : literalValue);
        } else if (t.getCallSignatures().length > 0) {
            // Function types: use text representation (FQN would be the property name, not the type)
            values.push(sourceFile ? t.getText(sourceFile) : t.getText());
        } else {
            // For non-literal types in a union, use the symbol's FQN
            const symbol = t.getAliasSymbol() || t.getSymbol();
            const fqn = getCleanFQN(symbol);
            if (fqn) {
                values.push(fqn);
            } else {
                // Fallback to text representation
                values.push(t.getText());
            }
        }
    }

    return values;
}

/**
 * Check if a type is an expandable enum (a union of simple literals from design system).
 * Returns true if the type should be expanded to show its member values.
 *
 * @param {Type} type - The resolved TypeScript type
 * @returns {boolean} - True if this type should be expanded
 */
function isExpandableEnum(type) {
    // Must be a union type
    if (!type.isUnion()) return false;

    const unionTypes = type.getUnionTypes();

    // Filter out null/undefined
    const meaningfulTypes = unionTypes.filter((t) => !t.isUndefined() && !t.isNull());

    // Must have at least 2 meaningful members
    if (meaningfulTypes.length < 2) return false;

    // All members must be simple literals (string or number)
    const allSimpleLiterals = meaningfulTypes.every((t) => {
        if (t.isBooleanLiteral()) return true;
        if (t.isLiteral()) {
            const value = t.getLiteralValue();
            return typeof value === 'string' || typeof value === 'number';
        }
        return false;
    });

    if (!allSimpleLiterals) return false;

    // Check that the type alias (if any) comes from design system packages
    const aliasSymbol = type.getAliasSymbol();
    if (aliasSymbol) {
        const declarations = aliasSymbol.getDeclarations();
        if (declarations.length > 0) {
            const filePath = declarations[0].getSourceFile().getFilePath();
            // Expand only types from lumx-core, lumx-react, or lumx-vue
            const isDesignSystem =
                filePath.includes('lumx-core') || filePath.includes('lumx-react') || filePath.includes('lumx-vue');
            // Skip types from node_modules (like React types)
            const isNodeModules = filePath.includes('node_modules');
            return isDesignSystem && !isNodeModules;
        }
    }

    // If no alias symbol, check if it's an inline union (always expand)
    return true;
}

/**
 * Get the type text representation, handling unions and complex types.
 * Uses ts-morph symbol APIs to get clean fully qualified names where possible.
 *
 * @param {Type} type - The TypeScript type object
 * @param {Node} [valueDecl] - The value declaration (used to get original type annotation)
 * @param {SourceFile} [sourceFile] - The source file (used for scoped type text with short names)
 */
function getTypeText(type, valueDecl, sourceFile) {
    const typeNode = valueDecl?.getTypeNode?.();

    // Handle special types early (any, unknown, never)
    const typeText = type.getText();
    if (typeText === 'any' || typeText === 'unknown' || typeText === 'never') {
        return typeText;
    }

    // Handle union types
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes();

        // Check if this is an expandable enum (simple literal union from design system)
        // If so, expand it to show the actual values instead of the type name
        if (isExpandableEnum(type)) {
            const values = extractUnionLiteralValues(unionTypes, sourceFile);
            return values.length === 1 ? values[0] : values;
        }

        // Complex union: try to get clean name from type node or alias
        if (typeNode) {
            const name = getTypeNameFromNode(typeNode);
            if (name !== null) {
                return name;
            }
        }

        // Check if the type itself is an alias (like ReactNode)
        const aliasSymbol = type.getAliasSymbol();
        if (aliasSymbol) {
            const fqn = getCleanFQN(aliasSymbol);
            if (fqn) return fqn;
        }

        // Fallback: extract values from the resolved union
        const values = extractUnionLiteralValues(unionTypes, sourceFile);
        return values.length === 1 ? values[0] : values;
    }

    // Handle single types
    if (typeNode) {
        const name = getTypeNameFromNode(typeNode);
        if (name !== null) {
            return name;
        }
    }

    // Handle single literal type
    if (type.isLiteral()) {
        const literalValue = type.getLiteralValue();
        return typeof literalValue === 'string' ? JSON.stringify(literalValue) : literalValue;
    }

    // Handle boolean literal (true/false as single type)
    if (type.isBooleanLiteral()) {
        return type.getText() === 'true';
    }

    // Function types: use text representation (FQN would be the property name, not the type)
    if (type.getCallSignatures().length > 0) {
        return sourceFile ? type.getText(sourceFile) : type.getText();
    }

    // Fallback: use symbol FQN or type text
    const symbol = type.getAliasSymbol() || type.getSymbol();
    const fqn = getCleanFQN(symbol);
    return fqn || type.getText();
}

/**
 * Convert a JSDoc comment (string or array of JSDocComment nodes) to a trimmed string.
 */
function getCommentText(comment) {
    if (typeof comment === 'string') return comment.trim();
    if (comment) {
        return comment
            .map((c) => (typeof c === 'string' ? c : c.getText?.() || ''))
            .join('')
            .trim();
    }
    return '';
}

/**
 * Search for a value across all declarations of a property symbol.
 * Tries the valueDeclaration first, then falls back to getDeclarations().
 *
 * @param {Symbol} propSymbol - The property symbol
 * @param {function} extractFn - Function that extracts a value from a declaration node.
 *                                Should return undefined/falsy to continue searching.
 * @param {*} defaultValue - Value to return if nothing is found
 * @returns {*} - The first non-default value found, or defaultValue
 */
function findInDeclarations(propSymbol, extractFn, defaultValue) {
    // Try valueDeclaration first
    const valueDecl = propSymbol.getValueDeclaration?.();
    if (valueDecl) {
        const result = extractFn(valueDecl);
        if (result !== undefined && result !== defaultValue) return result;
    }

    // Fallback to declarations (for Pick<> and other mapped types)
    const declarations = propSymbol.getDeclarations?.() || [];
    for (const decl of declarations) {
        const result = extractFn(decl);
        if (result !== undefined && result !== defaultValue) return result;
    }

    return defaultValue;
}

/**
 * Get JSDoc description from a declaration node.
 */
function getJsDocFromDeclaration(decl) {
    if (!decl) return '';
    const jsDocs = decl.getJsDocs?.();
    if (jsDocs && jsDocs.length > 0) {
        return getCommentText(jsDocs[0].getComment());
    }
    return '';
}

/**
 * Get JSDoc description for a property symbol.
 *
 * @param {Symbol} propSymbol - The property symbol
 * @returns {string} - The JSDoc description
 */
function getJsDocDescription(propSymbol) {
    return findInDeclarations(propSymbol, getJsDocFromDeclaration, '');
}

/**
 * Get @deprecated tag comment from a declaration node's JSDoc.
 * @returns {string|undefined} - The deprecation reason, or empty string if deprecated without reason, or undefined if not deprecated.
 */
function getJsDocDeprecatedFromDeclaration(decl) {
    if (!decl) return undefined;
    const jsDocs = decl.getJsDocs?.();
    if (jsDocs) {
        for (const jsDoc of jsDocs) {
            const tags = jsDoc.getTags?.();
            if (!tags) continue;
            for (const tag of tags) {
                if (tag.getTagName() === 'deprecated') {
                    return getCommentText(tag.getComment()) ?? '';
                }
            }
        }
    }
    return undefined;
}

/**
 * Get @deprecated reason for a property symbol.
 *
 * @param {Symbol} propSymbol - The property symbol
 * @returns {string|undefined} - The deprecation reason (or empty string if no reason), or undefined if not deprecated.
 */
function getJsDocDeprecated(propSymbol) {
    return findInDeclarations(propSymbol, getJsDocDeprecatedFromDeclaration, undefined);
}

/**
 * Get @alias tag value from a declaration node's JSDoc.
 */
function getJsDocAliasFromDeclaration(decl) {
    if (!decl) return undefined;
    const jsDocs = decl.getJsDocs?.();
    if (jsDocs) {
        for (const jsDoc of jsDocs) {
            const tags = jsDoc.getTags?.();
            if (!tags) continue;
            for (const tag of tags) {
                if (tag.getTagName() === 'alias') {
                    return getCommentText(tag.getComment()) || undefined;
                }
            }
        }
    }
    return undefined;
}

/**
 * Get @alias target for a property symbol.
 * Returns the alias target prop name, or undefined if not an alias.
 *
 * @param {Symbol} propSymbol - The property symbol
 * @returns {string|undefined} - The alias target prop name
 */
function getJsDocAlias(propSymbol) {
    return findInDeclarations(propSymbol, getJsDocAliasFromDeclaration, undefined);
}

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

    // Look for DEFAULT_PROPS constant
    for (const varDecl of sourceFile.getVariableDeclarations()) {
        if (varDecl.getName() !== 'DEFAULT_PROPS') continue;

        const initializer = varDecl.getInitializer();
        if (!initializer || initializer.getKindName() !== 'ObjectLiteralExpression') continue;

        for (const prop of initializer.getProperties()) {
            if (prop.getKindName() === 'PropertyAssignment') {
                const name = prop.getName();
                const value = prop.getInitializer()?.getText();
                if (name && value) {
                    // Remove quotes from string literals
                    defaults[name] = value.replace(/^["']|["']$/g, '');
                }
            }
        }
        // Found DEFAULT_PROPS, no need to continue
        break;
    }

    return defaults;
}

/**
 * Extract properties from an interface including inherited ones
 * @param {InterfaceDeclaration|TypeAliasDeclaration} interfaceDecl
 * @param {SourceFile} sourceFile
 * @param {string} rootPath - The project root path for relative file names
 * @param {Object} [defaultValues] - Default values map (prop name -> default value string)
 */
function extractPropertiesFromInterface(interfaceDecl, sourceFile, rootPath, defaultValues = {}) {
    const properties = [];
    const seenProps = new Set();
    // Track alias relationships: alias prop name -> target prop name
    const aliasMap = new Map();

    // Get the type of the interface
    const interfaceType = interfaceDecl.getType();

    // Get all properties including inherited ones
    const typeProperties = interfaceType.getProperties();

    for (const prop of typeProperties) {
        const name = prop.getName();

        // Skip duplicates
        if (seenProps.has(name)) continue;
        seenProps.add(name);

        // Check for @alias tag
        const aliasTarget = getJsDocAlias(prop);
        if (aliasTarget) {
            aliasMap.set(name, aliasTarget);
            continue;
        }

        // Get the value declaration for this property (may be undefined for Pick<> types)
        const valueDecl = prop.getValueDeclaration();

        // Get the type at the location
        const propType = prop.getTypeAtLocation(sourceFile);
        const optional = prop.isOptional();

        // Get default value if any
        let defaultValue = defaultValues[name] || null;

        const deprecatedReason = getJsDocDeprecated(prop);
        const deprecated = deprecatedReason !== undefined;

        // Build description, appending @deprecated reason if present
        let description = getJsDocDescription(prop);
        if (deprecated && deprecatedReason) {
            const deprecatedText = `@deprecated ${deprecatedReason}`;
            description = description ? `${description}\n${deprecatedText}` : deprecatedText;
        }

        const propInfo = {
            name,
            description,
            required: !optional,
            deprecated,
            type: getTypeText(propType, valueDecl, sourceFile),
            declarations: getDeclarations(prop, rootPath),
            defaultValue,
        };

        properties.push(propInfo);
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

/**
 * Find type by name across the project
 */
function findTypeByName(project, typeName) {
    // Search in all source files
    for (const sourceFile of project.getSourceFiles()) {
        // Check interfaces
        for (const iface of sourceFile.getInterfaces()) {
            if (iface.getName() === typeName) {
                return iface;
            }
        }

        // Check type aliases
        for (const typeAlias of sourceFile.getTypeAliases()) {
            if (typeAlias.getName() === typeName) {
                return typeAlias;
            }
        }
    }

    return null;
}

/**
 * Find the component interface by analyzing the source file.
 * Uses a prioritized search strategy to find the most appropriate Props type.
 */
function findComponentInterface(sourceFile, project) {
    const interfaces = sourceFile.getInterfaces();
    const typeAliases = sourceFile.getTypeAliases();
    const baseName = path.basename(sourceFile.getFilePath(), '.tsx');
    const expectedPropsName = baseName + 'Props';

    // Combine interfaces and type aliases as candidates
    const candidates = [...interfaces, ...typeAliases];

    // Prioritized search predicates (highest priority first)
    const searchStrategies = [
        // 1. Exact match: ComponentNameProps
        (decl) => decl.getName() === expectedPropsName,
        // 2. Exported interface/type ending with Props
        (decl) => decl.getName().endsWith('Props') && decl.isExported?.(),
        // 3. Any interface/type ending with Props
        (decl) => decl.getName().endsWith('Props'),
        // 4. Any exported interface
        (decl) => decl.isExported?.(),
    ];

    // Try each strategy in order
    for (const predicate of searchStrategies) {
        const match = candidates.find(predicate);
        if (match) return match;
    }

    // Fall back to project-wide search for imported/re-exported types
    const projectWideType = findTypeByName(project, expectedPropsName);
    if (projectWideType) return projectWideType;

    // Last resort: first interface in file
    return interfaces[0] || null;
}

/**
 * Get the root path for a ts-morph project (monorepo root).
 * @param {Project} project - The ts-morph project
 * @returns {string} - The root path
 */
function getRootPath(project) {
    const configFilePath = project.getCompilerOptions().configFilePath;
    return configFilePath ? path.resolve(path.dirname(configFilePath), '../..') : process.cwd();
}

/**
 * Get a source file from a project, adding it if necessary.
 * @param {Project} project - The ts-morph project
 * @param {string} filePath - Path to the source file
 * @returns {SourceFile|null} - The source file or null
 */
function getSourceFile(project, filePath) {
    let sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) {
        sourceFile = project.addSourceFileAtPath(filePath);
    }
    return sourceFile || null;
}

exports.createProject = createProject;
exports.getRootPath = getRootPath;
exports.getSourceFile = getSourceFile;
exports.findComponentInterface = findComponentInterface;
exports.findTypeByName = findTypeByName;
exports.extractPropertiesFromInterface = extractPropertiesFromInterface;
exports.extractDefaultValues = extractDefaultValues;
exports.getJsDocFromDeclaration = getJsDocFromDeclaration;
exports.getJsDocDescription = getJsDocDescription;
exports.getTypeText = getTypeText;
