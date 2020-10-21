const ts = require('typescript');

/**
 * Split union TS union type string (can't use a simple string split since `|` may appear in nested types).
 */
module.exports = (string) => {
    const sourceFile = ts.createSourceFile('fakeFile', `type t = ${string}`);
    const type = sourceFile.statements[0].type;
    if (type.kind === ts.SyntaxKind.UnionType) {
        // Print union type members to string array.
        return type.types.map((t) => ts.createPrinter().printNode(ts.EmitHint.Unspecified, t, sourceFile));
    }

    return string ? [string] : [];
};
