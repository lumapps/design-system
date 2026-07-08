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

exports.getJsDocFromDeclaration = getJsDocFromDeclaration;
exports.getJsDocDescription = getJsDocDescription;
exports.getJsDocDeprecatedFromDeclaration = getJsDocDeprecatedFromDeclaration;
exports.getJsDocDeprecated = getJsDocDeprecated;
exports.isJsDocInternal = isJsDocInternal;
exports.getJsDocAlias = getJsDocAlias;
