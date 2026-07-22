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

exports.sanitizeTypeText = sanitizeTypeText;
exports.getTypeText = getTypeText;
