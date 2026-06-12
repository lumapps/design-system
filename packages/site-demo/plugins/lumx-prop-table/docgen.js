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

    // Handle type references (named types like React.Ref<T>, ComboboxPopoverProps, etc.)
    if (kind === 'TypeReference') {
        // Prefer the written type name from the node directly (getTypeName()) because resolving
        // through the symbol/alias can yield the underlying type (e.g. ComboboxPopoverProps → Partial).
        const writtenName = typeNode.getTypeName?.()?.getText();
        if (writtenName) {
            // Append explicit type arguments if present in the written code
            const typeArgs = typeNode.getTypeArguments?.();
            if (typeArgs && typeArgs.length > 0) {
                const argTexts = typeArgs.map((a) => a.getText());
                return `${writtenName}<${argTexts.join(', ')}>`;
            }
            return writtenName;
        }

        // Fallback: resolve through the symbol
        const symbol = type.getAliasSymbol() || type.getSymbol();
        const fqn = getCleanFQN(symbol);
        if (fqn) {
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
 * Format a type alias FQN with its type arguments, if any.
 * E.g. alias="Selector", args=["O"] → "Selector<O>"
 *
 * @param {string} fqn - The clean fully-qualified name
 * @param {Type[]} aliasTypeArgs - The alias type arguments array
 * @param {SourceFile} [sourceFile] - Source file for scoped text
 * @returns {string}
 */
function formatFQNWithArgs(fqn, aliasTypeArgs, sourceFile) {
    if (!aliasTypeArgs || aliasTypeArgs.length === 0) return fqn;
    const argTexts = aliasTypeArgs.map((a) => sanitizeTypeText(sourceFile ? a.getText(sourceFile) : a.getText()));
    return `${fqn}<${argTexts.join(', ')}>`;
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
            // Function types: use sanitized text representation
            values.push(sanitizeTypeText(sourceFile ? t.getText(sourceFile) : t.getText()));
        } else {
            // Array types (T[]) — use sanitized text directly rather than losing the element type
            if (t.isArray?.()) {
                values.push(sanitizeTypeText(sourceFile ? t.getText(sourceFile) : t.getText()));
                continue;
            }
            // For non-literal types in a union, use the symbol's FQN (with type args)
            const symbol = t.getAliasSymbol() || t.getSymbol();
            const fqn = getCleanFQN(symbol);
            if (fqn) {
                // For generic utility types (Partial, Record, etc.) prefer sanitized text to preserve args
                const aliasArgs = t.getAliasTypeArguments();
                if (aliasArgs.length > 0) {
                    values.push(formatFQNWithArgs(fqn, aliasArgs, sourceFile));
                } else {
                    values.push(fqn);
                }
            } else {
                // Fallback to sanitized text representation
                values.push(sanitizeTypeText(sourceFile ? t.getText(sourceFile) : t.getText()));
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
 * Sanitize a raw type text string, removing leaked absolute import paths.
 * TypeScript sometimes emits `import("/abs/path/to/file").TypeName` in type text;
 * this strips the import wrapper and keeps only the type name.
 *
 * @param {string} text - The raw type text
 * @returns {string} - Cleaned type text
 */
function sanitizeTypeText(text) {
    // Replace `import("...").Name` with just `Name`
    return text.replace(/import\("[^"]*"\)\./g, '');
}

/**
 * Check if a union type contains "complex" members (mapped types, conditionals, generics)
 * that would produce unreadable output if we try to enumerate individual members.
 * When true, prefer falling back to a sanitized whole-type text instead.
 *
 * @param {Type[]} unionTypes - The union member types (undefined/null already excluded)
 * @returns {boolean}
 */
function hasComplexUnionMembers(unionTypes) {
    return unionTypes.some((t) => {
        if (t.isLiteral() || t.isBooleanLiteral() || t.isBoolean() || t.isString() || t.isNumber()) return false;
        if (t.getCallSignatures().length > 0) return false;
        // If the type has no alias and no clean symbol (e.g. mapped types, conditional types)
        const symbol = t.getAliasSymbol() || t.getSymbol();
        if (!getCleanFQN(symbol)) return true;
        return false;
    });
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
        const meaningfulTypes = unionTypes.filter((t) => !t.isUndefined() && !t.isNull());

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
            if (fqn) return formatFQNWithArgs(fqn, type.getAliasTypeArguments(), sourceFile);
        }

        // If the union has complex members (mapped/conditional types), fall back to
        // sanitized whole-type text rather than dumping unreadable member representations.
        if (hasComplexUnionMembers(meaningfulTypes)) {
            return sanitizeTypeText(sourceFile ? type.getText(sourceFile) : type.getText());
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
        return sanitizeTypeText(sourceFile ? type.getText(sourceFile) : type.getText());
    }

    // Fallback: use symbol FQN (with type args) or sanitized type text
    const symbol = type.getAliasSymbol() || type.getSymbol();
    const fqn = getCleanFQN(symbol);
    if (fqn) return formatFQNWithArgs(fqn, type.getAliasTypeArguments(), sourceFile);
    return sanitizeTypeText(sourceFile ? type.getText(sourceFile) : type.getText());
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
 * Check whether a declaration has an @internal JSDoc tag.
 * @param {Node} decl - The declaration node
 * @returns {boolean}
 */
function isJsDocInternalFromDeclaration(decl) {
    if (!decl) return false;
    const jsDocs = decl.getJsDocs?.();
    if (jsDocs) {
        for (const jsDoc of jsDocs) {
            const tags = jsDoc.getTags?.();
            if (!tags) continue;
            for (const tag of tags) {
                if (tag.getTagName() === 'internal') return true;
            }
        }
    }
    return false;
}

/**
 * Check whether a property symbol is marked @internal in any of its declarations.
 * @param {Symbol} propSymbol
 * @returns {boolean}
 */
function isJsDocInternal(propSymbol) {
    return findInDeclarations(propSymbol, (decl) => (isJsDocInternalFromDeclaration(decl) ? true : undefined), false);
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

    return {
        name,
        description,
        required: !optional,
        deprecated,
        type: getTypeText(propType, valueDecl, sourceFile),
        declarations: getDeclarations(prop, rootPath),
        defaultValue,
    };
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

/**
 * Detect if a type is a discriminated union of object types (not a simple literal union).
 * Returns the discriminant property name and the union members if detected, else null.
 *
 * A discriminant is a property that:
 *  - exists in all union members
 *  - has a unique string-literal type (ignoring `undefined`) in each member
 *
 * @param {Type} type - The resolved type of the Props declaration
 * @param {SourceFile} sourceFile - The source file for type resolution location
 * @returns {{ discriminant: string, members: Type[] } | null}
 */
function detectDiscriminatedUnion(type, sourceFile) {
    if (!type.isUnion()) return null;

    const members = type.getUnionTypes();

    // Must have 2+ members
    if (members.length < 2) return null;

    // All members must be object-like (not simple literals)
    if (members.some((m) => m.isLiteral() || m.isUndefined() || m.isNull())) return null;

    // Search for a discriminant prop in the first member's properties
    const firstMemberProps = members[0].getProperties();
    for (const prop of firstMemberProps) {
        const propName = prop.getName();
        const discriminantValues = [];
        let valid = true;

        for (const member of members) {
            const memberProp = member.getProperty(propName);
            if (!memberProp) {
                valid = false;
                break;
            }
            const pt = memberProp.getTypeAtLocation(sourceFile);
            // Allow `"value" | undefined` — strip undefined
            const nonUndef = pt.isUnion() ? pt.getUnionTypes().filter((u) => !u.isUndefined()) : [pt];
            if (nonUndef.length === 1 && nonUndef[0].isStringLiteral()) {
                discriminantValues.push(nonUndef[0].getLiteralValue());
            } else {
                valid = false;
                break;
            }
        }

        if (valid && new Set(discriminantValues).size === members.length) {
            return { discriminant: propName, members };
        }
    }

    return null;
}

/**
 * Extract @typeParam tags from a declaration's JSDoc.
 *
 * ts-morph's JSDocTypeParameterTag may not expose the parameter name via getNameNode()
 * (it returns undefined). In that case, the comment text itself starts with the name:
 * e.g. `O - Option object type...` → name="O", description="Option object type...".
 *
 * @param {InterfaceDeclaration|TypeAliasDeclaration} decl
 * @returns {Array<{name: string, description: string}>}
 */
function extractTypeParams(decl) {
    const result = [];
    const jsDocs = decl.getJsDocs?.() ?? [];
    for (const jsDoc of jsDocs) {
        for (const tag of jsDoc.getTags?.() ?? []) {
            const tagName = tag.getTagName();
            if (tagName !== 'typeParam' && tagName !== 'template') continue;

            const rawComment = getCommentText(tag.getComment());

            // Try getNameNode() first (works for some ts-morph versions)
            const nameFromNode = tag.getNameNode?.()?.getText();
            if (nameFromNode) {
                result.push({ name: nameFromNode, description: rawComment });
                continue;
            }

            // Fallback: parse "Name - description" or "Name description" from the comment
            // The name is the first word (type param names are single uppercase letters or PascalCase)
            const match = rawComment.match(/^(\w+)\s*[-–]?\s*(.*)/s);
            if (match) {
                result.push({ name: match[1], description: match[2].trim() });
            }
        }
    }
    return result;
}

/**
 * Extract props for a discriminated-union Props type, returning common props and per-variant groups.
 *
 * @param {InterfaceDeclaration|TypeAliasDeclaration} interfaceDecl
 * @param {SourceFile} sourceFile
 * @param {string} rootPath
 * @param {Object} defaultValues
 * @returns {{ commonProps: Object[], variants: { discriminant: string, items: Array<{ value: string, props: Object[] }> } } | null}
 *   Returns null if not a discriminated union.
 */
function extractDiscriminatedUnionProps(interfaceDecl, sourceFile, rootPath, defaultValues) {
    const type = interfaceDecl.getType();
    const unionInfo = detectDiscriminatedUnion(type, sourceFile);
    if (!unionInfo) return null;

    const { discriminant, members } = unionInfo;

    // Collect all props per member using Omit/Pick-aware resolution
    const memberPropMaps = members.map((m) => collectPropsFromType(m));

    // Determine common props: present in ALL members with:
    // 1. The same name
    // 2. A non-never type in every member (never = intentionally excluded from that variant)
    // 3. The same type text across all members (variant-specific types like O vs O[] stay in variants)
    const commonPropNames = new Set(
        [...memberPropMaps[0].keys()].filter((name) => {
            if (!memberPropMaps.every((m) => m.has(name))) return false;

            // Exclude discriminant — handled separately as the variant key
            if (name === discriminant) return false;

            // Collect type text per member using the prop map (supports deep intersection props)
            const typeTexts = memberPropMaps.map((memberMap) => {
                const sym = memberMap.get(name);
                if (!sym) return null;
                const t = sym.getTypeAtLocation(sourceFile);
                const resolvedText = t.getText();
                // If resolved type is `never` or `undefined` (from `prop?: never`), check typeNode
                if (resolvedText === 'never') return null;
                // Also check typeNode for `never` annotation
                const valDecl = sym.getValueDeclaration?.();
                if (valDecl?.getTypeNode?.()?.getText() === 'never') return null;
                return resolvedText;
            });

            // Prop is common only if all members have the same non-null type text
            if (typeTexts.some((t) => t === null)) return false;
            const firstText = typeTexts[0];
            return typeTexts.every((t) => t === firstText);
        }),
    );

    // Gather common prop symbols from the first member (they share the same symbol for inherited props)
    const commonPropMap = new Map();
    for (const name of commonPropNames) {
        commonPropMap.set(name, memberPropMaps[0].get(name));
    }

    // Build common props list (exclude the discriminant itself — shown in variant headers)
    const commonPropMapWithoutDiscriminant = new Map(commonPropMap);
    commonPropMapWithoutDiscriminant.delete(discriminant);
    const commonProps = extractPropertiesFromInterface(
        interfaceDecl,
        sourceFile,
        rootPath,
        defaultValues,
        commonPropMapWithoutDiscriminant,
    );

    // Build per-variant groups: only props unique to each member (not in common, and not `never`)
    const variantItems = members.map((member, idx) => {
        const memberMap = memberPropMaps[idx];
        const variantPropMap = new Map();
        for (const [name, sym] of memberMap) {
            if (commonPropNames.has(name)) continue;
            if (name === discriminant) continue;
            // Skip `never`-typed props (they're "explicitly blocked" markers, not real props).
            // `prop?: never` resolves to `undefined` in the type system, so check both the
            // resolved type text AND the value declaration's typeNode text.
            const propType = sym.getTypeAtLocation(sourceFile);
            if (propType.getText() === 'never') continue;
            const propValueDecl = sym.getValueDeclaration?.();
            if (propValueDecl?.getTypeNode?.()?.getText() === 'never') continue;
            variantPropMap.set(name, sym);
        }

        // Get the discriminant value for this member
        const discriminantProp = member.getProperty(discriminant);
        const discriminantType = discriminantProp?.getTypeAtLocation(sourceFile);
        const nonUndef = discriminantType?.isUnion()
            ? discriminantType.getUnionTypes().filter((u) => !u.isUndefined())
            : [discriminantType];
        const value = nonUndef[0]?.isStringLiteral() ? nonUndef[0].getLiteralValue() : String(idx);

        const props = [...variantPropMap.values()].map((sym) =>
            propSymbolToInfo(sym, sourceFile, rootPath, defaultValues),
        );

        // Mark the variant as default using DEFAULT_PROPS constant if available, otherwise
        // fall back to detecting an optional literal discriminant (e.g. `selectionType?: 'single'`
        // is optional only in the single-member, meaning 'single' is the implicit default).
        let isDefault = false;
        if (defaultValues[discriminant] !== undefined) {
            isDefault = value === defaultValues[discriminant];
        } else {
            const discriminantPropSym = member.getProperty(discriminant);
            isDefault = discriminantPropSym?.isOptional() === true;
        }

        return { value, props, ...(isDefault ? { isDefault: true } : {}) };
    });

    // Only emit variants if at least one variant has props worth showing
    const hasVariantProps = variantItems.some((item) => item.props.length > 0);
    if (!hasVariantProps) return null;

    return {
        commonProps,
        variants: { discriminant, items: variantItems },
    };
}

/**
 * Detect and extract props for a generic Props type that uses a selection-mode type parameter
 * (e.g. `S extends 'single' | 'multiple'`) with conditional `value` / `onChange` types.
 *
 * This handles the React `SelectButtonProps<O, E, S>` pattern where the type is NOT a union
 * at the TypeScript level (because S is unbound), but semantically behaves like one.
 *
 * Strategy:
 *  1. Check whether the Props type alias has a type param constrained to a union of string literals
 *     AND the type has a `selectionType` property typed as that param.
 *  2. Find all props whose typeNode text contains `S extends '...' ? A : B` conditionals.
 *  3. Produce two variant prop groups by text-substituting the resolved branch for each value of S.
 *  4. Common props are all props that DON'T have conditional types (i.e., the same across all modes).
 *
 * @param {TypeAliasDeclaration} interfaceDecl - Must be a TypeAliasDeclaration with type params
 * @param {SourceFile} sourceFile
 * @param {string} rootPath
 * @param {Object} defaultValues
 * @returns {{ commonProps: Object[], variants: { discriminant: string, items: Array<{ value: string, props: Object[] }> } } | null}
 */
function extractConditionalSelectionVariants(interfaceDecl, sourceFile, rootPath, defaultValues) {
    // Only applies to type aliases (not plain interfaces)
    const typeParams = interfaceDecl.getTypeParameters?.();
    if (!typeParams || typeParams.length === 0) return null;

    // Find a type param with a string-literal-union constraint (e.g. `S extends 'single' | 'multiple'`)
    let selectionParam = null;
    let selectionValues = [];
    let selectionDefaultValue = null;

    for (const tp of typeParams) {
        const constraint = tp.getConstraint();
        if (!constraint) continue;
        const constraintType = constraint.getType();
        if (!constraintType.isUnion()) continue;
        const members = constraintType.getUnionTypes();
        if (!members.every((m) => m.isStringLiteral())) continue;
        const values = members.map((m) => m.getLiteralValue());
        if (values.length < 2) continue;
        selectionParam = tp.getName();
        selectionValues = values;
        // Capture the default value if present (e.g. `= 'single'`)
        const defaultNode = tp.getDefault();
        if (defaultNode) {
            const defaultType = defaultNode.getType();
            if (defaultType.isStringLiteral()) {
                selectionDefaultValue = defaultType.getLiteralValue();
            }
        }
        break;
    }

    if (!selectionParam) return null;

    // Verify the Props type has a `selectionType` prop typed as `S` (or `S | undefined`)
    const type = interfaceDecl.getType();
    const selTypeProp = type.getProperty('selectionType');
    if (!selTypeProp) return null;
    const selTypeDecl = selTypeProp.getValueDeclaration?.();
    const selTypeNode = selTypeDecl?.getTypeNode?.();
    if (!selTypeNode || selTypeNode.getText() !== selectionParam) return null;

    // Collect all props from the type
    const allProps = type.getProperties();

    // For each prop, check if its typeNode contains a conditional involving `S`
    // Pattern: `S extends 'X' ? TrueType : FalseType`
    const conditionalPattern = new RegExp(
        `\\b${selectionParam}\\s+extends\\s+`,
    );

    // Split props into common (no conditional) and conditional (per-variant)
    const commonPropSymbols = [];
    const conditionalPropSymbols = []; // [{name, sym, typeNodeText}]

    for (const sym of allProps) {
        if (sym.getName() === 'selectionType') continue; // shown in variant header, skip

        const decl = sym.getValueDeclaration?.();
        const typeNodeText = decl?.getTypeNode?.()?.getText() ?? '';

        if (conditionalPattern.test(typeNodeText)) {
            conditionalPropSymbols.push({ name: sym.getName(), sym, typeNodeText });
        } else {
            commonPropSymbols.push(sym);
        }
    }

    // If no conditional props found, this isn't a selection-mode generic
    if (conditionalPropSymbols.length === 0) return null;

    // Build common props list
    const commonPropMap = new Map();
    for (const sym of commonPropSymbols) {
        commonPropMap.set(sym.getName(), sym);
    }
    const commonProps = extractPropertiesFromInterface(
        interfaceDecl,
        sourceFile,
        rootPath,
        defaultValues,
        commonPropMap,
    );

    // For each selection value, resolve each conditional prop's type by text substitution.
    // `S extends 'multiple' ? O[] : O` with S='multiple' → 'O[]'; with S='single' → 'O'
    // This is pure text manipulation — we don't need full TS resolution since O remains generic.
    function resolveConditional(typeNodeText, paramName, paramValue) {
        // Parse the outermost conditional: `P extends 'V' ? TrueType : FalseType`
        // We can't use a simple regex for TrueType because it may contain `:` (e.g. function types).
        // Instead, find the `?` after the extends clause, then scan for the balancing `:` at depth 0.
        const extendsRegex = new RegExp(`\\b${paramName}\\s+extends\\s+'([^']+)'\\s*\\?\\s*`);
        const extendsMatch = typeNodeText.match(extendsRegex);
        if (!extendsMatch) return typeNodeText;

        const condValue = extendsMatch[1];
        const afterQuestion = typeNodeText.slice(extendsMatch.index + extendsMatch[0].length);

        // Scan afterQuestion for the `:` that splits true/false branches at depth 0.
        // Depth increases on `<`, `(`, `{` and decreases on `>`, `)`, `}`.
        // BUT `=>` is an arrow function — the `>` there must NOT decrease depth.
        // We track whether the previous non-space char was `=` to skip those `>`.
        let depth = 0;
        let splitIdx = -1;
        let prevNonSpace = '';
        for (let i = 0; i < afterQuestion.length; i++) {
            const ch = afterQuestion[i];
            if (ch === '<' || ch === '(' || ch === '{') {
                depth++;
            } else if (ch === ')' || ch === '}') {
                depth--;
            } else if (ch === '>') {
                // Only count as closing bracket if not part of `=>`
                if (prevNonSpace !== '=') depth--;
            } else if (ch === ':' && depth === 0) {
                splitIdx = i;
                break;
            }
            if (ch !== ' ') prevNonSpace = ch;
        }

        if (splitIdx === -1) return typeNodeText;

        const trueType = afterQuestion.slice(0, splitIdx).trim();
        const falseType = afterQuestion.slice(splitIdx + 1).trim();
        const result = paramValue === condValue ? trueType : falseType;
        // Recursively resolve any remaining conditionals in the result
        return conditionalPattern.test(result) ? resolveConditional(result, paramName, paramValue) : result;
    }

    const variantItems = selectionValues.map((value) => {
        const props = conditionalPropSymbols.map(({ name, sym, typeNodeText }) => {
            const resolvedType = resolveConditional(typeNodeText, selectionParam, value);

            // Build the prop info, overriding the type with the resolved conditional
            const decl = sym.getValueDeclaration?.();
            const optional = sym.isOptional();
            const defaultValue = defaultValues[name] || null;
            const deprecatedReason = getJsDocDeprecated(sym);
            const deprecated = deprecatedReason !== undefined;
            let description = getJsDocDescription(sym);
            if (deprecated && deprecatedReason) {
                const deprecatedText = `@deprecated ${deprecatedReason}`;
                description = description ? `${description}\n${deprecatedText}` : deprecatedText;
            }

            return {
                name,
                description,
                required: !optional,
                deprecated,
                type: sanitizeTypeText(resolvedType),
                declarations: getDeclarations(sym, rootPath),
                defaultValue,
            };
        });

        // Mark the variant as default using the type param default if present, otherwise
        // fall back to the DEFAULT_PROPS constant.
        let isDefault = false;
        if (selectionDefaultValue !== null) {
            isDefault = value === selectionDefaultValue;
        } else if (defaultValues['selectionType'] !== undefined) {
            isDefault = value === defaultValues['selectionType'];
        }
        return { value, props, ...(isDefault ? { isDefault: true } : {}) };
    });

    // Only emit if at least one variant has non-trivial props (e.g. single=O, multiple=O[] differ)
    const allSame = variantItems.every((item) =>
        item.props.every((p, i) => p.type === variantItems[0].props[i]?.type),
    );
    if (allSame) return null;

    return {
        commonProps,
        variants: { discriminant: 'selectionType', items: variantItems },
    };
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
exports.extractDiscriminatedUnionProps = extractDiscriminatedUnionProps;
exports.extractConditionalSelectionVariants = extractConditionalSelectionVariants;
exports.extractTypeParams = extractTypeParams;
exports.extractDefaultValues = extractDefaultValues;
exports.getJsDocFromDeclaration = getJsDocFromDeclaration;
exports.getJsDocDeprecatedFromDeclaration = getJsDocDeprecatedFromDeclaration;
exports.getJsDocDescription = getJsDocDescription;
exports.getTypeText = getTypeText;
