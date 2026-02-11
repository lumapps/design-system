const path = require('path');
const {
    createProject,
    getSourceFile,
    getRootPath,
    findComponentInterface,
    extractPropertiesFromInterface,
    extractDefaultValues,
} = require('./docgen.js');

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
function parseReactComponent(project, filePath) {
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
    const props = extractPropertiesFromInterface(interfaceDecl, sourceFile, rootPath, defaultValues);
    const displayName = getComponentName(sourceFile);

    return {
        displayName,
        props,
    };
}

exports.createProject = createProject;
exports.parseReactComponent = parseReactComponent;

/**
 * CLI entrypoint - run docgen for a single React component
 * Usage: node react-docgen.js <component-path>
 * Example: node react-docgen.js packages/lumx-react/src/components/button/Button.tsx
 */
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage: node react-docgen.js <component-path>');
        console.error('Example: node react-docgen.js packages/lumx-react/src/components/button/Button.tsx');
        process.exit(1);
    }

    const componentPath = args[0];
    const lumxReactPath = path.resolve(__dirname, '../../../../packages/lumx-react');

    try {
        const project = createProject(lumxReactPath);
        const result = parseReactComponent(project, path.resolve(componentPath));

        if (!result) {
            console.error('Error: Could not extract props from component');
            process.exit(1);
        }

        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}
