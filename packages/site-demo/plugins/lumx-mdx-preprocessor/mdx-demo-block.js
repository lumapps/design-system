const ts = require('typescript');

function parseDemo(content) {
    const sourceFile = ts.createSourceFile('demo.tsx', content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const scopeEntries = [];

    let importsCode = '';
    let bodyCode = '';

    for (const statement of sourceFile.statements) {
        if (ts.isImportDeclaration(statement)) {
            if (statement.importClause && !statement.importClause.isTypeOnly) {
                const { name, namedBindings } = statement.importClause;

                if (name) {
                    // import Foo from ...
                    scopeEntries.push(name.text);
                }

                if (namedBindings) {
                    if (ts.isNamedImports(namedBindings)) {
                        for (const element of namedBindings.elements) {
                            if (element.isTypeOnly) continue;
                            // import { Foo as Bar } -> name is Bar
                            scopeEntries.push(element.name.text);
                        }
                    } else if (ts.isNamespaceImport(namedBindings)) {
                        // import * as Foo ...
                        scopeEntries.push(namedBindings.name.text);
                    }
                }
            }
            importsCode += statement.getFullText(sourceFile);
        } else {
            bodyCode += statement.getFullText(sourceFile);
        }
    }

    // Add trailing content (comments, whitespace) to body
    if (sourceFile.endOfFileToken) {
        bodyCode += sourceFile.endOfFileToken.getFullText(sourceFile);
    }

    return {
        scopeEntries,
        importsCode: importsCode.trim(),
        bodyCode: bodyCode.trim(),
    };
}

module.exports = async (content) => {
    const { scopeEntries, importsCode, bodyCode } = parseDemo(content);

    const output = `
${content}

export const scope = {
    ${scopeEntries.join(',\n    ')}
};

export const code = ${JSON.stringify(bodyCode)};
export const imports = ${JSON.stringify(importsCode)};
`;
    return output;
};
