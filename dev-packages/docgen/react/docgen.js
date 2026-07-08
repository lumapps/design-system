const path = require('path');
const { getSourceFile, getRootPath, findComponentInterface } = require('../project.js');
const { extractPropertiesFromInterface, extractDefaultValues } = require('../internal/props.js');
const { extractDiscriminatedUnionProps, extractConditionalSelectionVariants, extractTypeParams } = require('../internal/variants.js');
const { getJsDocDeprecatedFromDeclaration } = require('../internal/jsdoc.js');

/**
 * Get the `@deprecated` JSDoc tag from a component's variable or function declaration.
 * @param {SourceFile} sourceFile - The source file
 * @param {string} componentName - The component name to look for
 * @returns {string|undefined} - The deprecation reason, or undefined if not deprecated
 */
function getComponentDeprecated(sourceFile, componentName) {
    // Check variable declarations (e.g., `export const Foo = forwardRef(...)`)
    for (const varDecl of sourceFile.getVariableDeclarations()) {
        if (varDecl.getName() === componentName) {
            // JSDoc is on the VariableStatement (parent of VariableDeclarationList)
            const varStatement = varDecl.getParent()?.getParent();
            const result = getJsDocDeprecatedFromDeclaration(varStatement);
            if (result !== undefined) return result;
        }
    }

    // Check function declarations
    for (const func of sourceFile.getFunctions()) {
        if (func.getName() === componentName && func.isExported()) {
            const result = getJsDocDeprecatedFromDeclaration(func);
            if (result !== undefined) return result;
        }
    }

    return undefined;
}

/**
 * Get the component name from the file (React-specific).
 * Looks for exported const or function declarations matching the file name.
 */
function getComponentName(sourceFile) {
    const baseName = path.basename(sourceFile.getFilePath(), '.tsx');

    // Look for exported const with displayName property
    const variableDeclarations = sourceFile.getVariableDeclarations();
    for (const varDecl of variableDeclarations) {
        const name = varDecl.getName();
        if (name && name === baseName) {
            return name;
        }
    }

    // Look for any exported variable that could be a component
    for (const varDecl of variableDeclarations) {
        if (varDecl.isExported()) {
            return varDecl.getName();
        }
    }

    // Look for function declarations
    const functions = sourceFile.getFunctions();
    for (const func of functions) {
        if (func.isExported()) {
            return func.getName() || baseName;
        }
    }

    return baseName;
}

/**
 * Parse a React component file and extract prop information
 * @param {Project} project - The ts-morph project
 * @param {string} filePath - Path to the component file
 */
exports.parseReactComponent = function parseReactComponent(project, filePath) {
    const sourceFile = getSourceFile(project, filePath);
    if (!sourceFile) {
        return null;
    }

    const interfaceDecl = findComponentInterface(sourceFile, project);
    if (!interfaceDecl) {
        return null;
    }

    const rootPath = getRootPath(project);
    const defaultValues = extractDefaultValues(sourceFile);
    const displayName = getComponentName(sourceFile);
    const deprecated = getComponentDeprecated(sourceFile, displayName);

    // Detect discriminated union Props (e.g. MenuButton variants) — true TS union
    const unionResult = extractDiscriminatedUnionProps(interfaceDecl, sourceFile, rootPath, defaultValues);
    // Detect generic selection-mode Props with conditional types (e.g. SelectButton<O,E,S>)
    const conditionalResult =
        !unionResult && extractConditionalSelectionVariants(interfaceDecl, sourceFile, rootPath, defaultValues);

    const splitResult = unionResult || conditionalResult;
    const result = splitResult
        ? { displayName, props: splitResult.commonProps, variants: splitResult.variants }
        : { displayName, props: extractPropertiesFromInterface(interfaceDecl, sourceFile, rootPath, defaultValues) };

    if (deprecated !== undefined) {
        result.deprecated = deprecated;
    }

    // Extract @typeParam documentation
    const typeParams = extractTypeParams(interfaceDecl);
    if (typeParams.length > 0) {
        result.typeParams = typeParams;
    }

    return result;
}
