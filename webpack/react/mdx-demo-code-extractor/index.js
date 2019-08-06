const visit = require('unist-util-visit');

/**
 * Combine import statements and jsx code into a formatted sample code for documentation.
 */
const getSourceCode = (importStatement, node) => {
    const code = `${importStatement}\nconst App = () => (\n${node.value}\n);`;

    return code
        .trim()
        .replace(/\n/g, '\\n')
        .replace(/"/g, '\\"');
};

/**
 * RegExp used to detect and replace demo block tags.
 */
const RE_DEMO_BLOCK = /<(DemoBlock)(.*?)>/;

const insertSourceCode = (sourceCode) => (...[_, tag, props]) => {
    return `<${tag} ${props.trim()} sourceCode="${sourceCode}">`;
};

/**
 * MDX plugin to extract and insert source code from demo block in MDX documents.
 */
module.exports = () => {
    return (tree) => {
        // Accumulate import statements.
        let importStatement = '';
        visit(tree, 'import', (node) => (importStatement += node.value));

        // Extract & Insert source code from demo blocks
        visit(tree, 'jsx', (node) => {
            if (node.value.match(RE_DEMO_BLOCK)) {
                const sourceCode = getSourceCode(importStatement, node);

                // Replace demo block tag to insert the source code in a its props
                node.value = node.value.replace(RE_DEMO_BLOCK, insertSourceCode(sourceCode));
            }
        });
    };
};
