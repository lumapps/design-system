const { sanitizeTypeText } = require('./type-text.js');
const { getJsDocDeprecated, getJsDocDescription } = require('./jsdoc.js');
const {
    getDeclarations,
    collectPropsFromType,
    extractPropertiesFromInterface,
    propSymbolToInfo,
    buildPropInfo,
} = require('./props.js');

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
            const optional = sym.isOptional();
            const defaultValue = defaultValues[name] || null;
            const deprecatedReason = getJsDocDeprecated(sym);
            const deprecated = deprecatedReason !== undefined;
            let description = getJsDocDescription(sym);
            if (deprecated && deprecatedReason) {
                const deprecatedText = `@deprecated ${deprecatedReason}`;
                description = description ? `${description}\n${deprecatedText}` : deprecatedText;
            }

            return buildPropInfo({
                name,
                description,
                required: !optional,
                deprecated,
                type: sanitizeTypeText(resolvedType),
                declarations: getDeclarations(sym, rootPath),
                defaultValue,
            });
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

exports.extractTypeParams = extractTypeParams;
exports.extractDiscriminatedUnionProps = extractDiscriminatedUnionProps;
exports.extractConditionalSelectionVariants = extractConditionalSelectionVariants;
