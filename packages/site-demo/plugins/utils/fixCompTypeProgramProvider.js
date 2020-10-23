const ts = require('typescript');
const path = require('path');
const lodash = require('lodash');

const getText = (sourceFile, node) => ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, sourceFile);

const getComponentDeclaration = (sourceFile, componentName) => {
    let componentStatement = sourceFile.statements.find(statement =>
        // Statement is a variable
        statement.kind === ts.SyntaxKind.VariableStatement
        // Variable name is the component name.
        && lodash.get(statement, 'declarationList.declarations[0].name.escapedText') === componentName,
    );
    return componentStatement && componentStatement.declarationList.declarations[0];
};

/**
 * Intercept TypeScript AST to remove intersection type on component types (that messes with `react-docgen-typescript`)
 * (ex: removes `& List` in `React.FC<ListProp> & List`)
 */
module.exports = (filePaths, compilerOptions) => () => {
    const program = ts.createProgram(filePaths, compilerOptions);
    const originalGetSourceFile = program.getSourceFile;
    program.getSourceFile = function(filePath) {
        const sourceFile = originalGetSourceFile(filePath);
        const componentName = path.basename(filePath).split('.').slice(0, -1).join('.');
        const declaration = getComponentDeclaration(sourceFile, componentName);
        if (lodash.get(declaration, 'type.kind') !== ts.SyntaxKind.IntersectionType) return sourceFile;

        const reactComponentType = declaration.type.types.find(type =>
            getText(sourceFile, type).match(/(React\.)?FC<\w+>/),
        );
        if (!reactComponentType) return sourceFile;

        // Replace intersection type with the react component type.
        declaration.type = reactComponentType;

        return sourceFile;
    };
    return program;
};
module.exports.getText = getText;
module.exports.getComponentDeclaration = getComponentDeclaration;
