const { get, partition } = require('lodash');

/**
 * Combine import statements and jsx code into a formatted sample code for documentation.
 */
const getSourceCode = (importStatement, code) => {
    return `${importStatement}\nconst App = ${code.trim()}`.trim().replace(/\n/g, '\\n');
};

/**
 * Transform <pre> element with JSX code into a demo block jsx element.
 */
function transformJSXCodeToJSXNode(importStatement, node) {
    const codeNode = node.children[0];
    const withThemeSwitcher = Boolean(codeNode.properties.withThemeSwitcher);
    const disableGrid = Boolean(codeNode.properties.disableGrid);
    const code = codeNode.children[0].value;
    const sourceCode = getSourceCode(importStatement, code);

    node.type = 'jsx';
    delete node.tagName;
    delete node.children;
    node.value = `<DemoBlock withThemeSwitcher={${withThemeSwitcher}} disableGrid={${disableGrid}} sourceCode={\`${sourceCode}\`}>{${code.trim().replace(/;$/, '')}}</DemoBlock>`;
}

const isJSXImport = (node) => node.type === 'import';
const isPreImport = (node) =>
    node.type === 'element' && node.tagName === 'pre' && get(node, ['children', 0, 'properties', 'import']);
const isImport = (node) => isJSXImport(node) || isPreImport(node);

const isPreJSXDemo = (node) =>
    node.type === 'element' && node.tagName === 'pre' && get(node, ['children', 0, 'properties', 'jsx']);
const DEMO_BLOCK_IMPORT = "import { DemoBlock } from 'LumX/demo/react/layout/DemoBlock';\n";

/**
 * MDX plugin to extract and insert source code from demo block in MDX documents.
 */
module.exports = () => {
    return (tree) => {
        const [importNodes, others] = partition(tree.children, isImport);
        // Accumulate import statements.
        let importStatement = '';
        importNodes.forEach((node) => {
            const importCode = isJSXImport(node) ? node.value : get(node, ['children', 0, 'children', 0, 'value']);
            importStatement += importCode;
        });
        tree.children = [
            // Group all imports at the top with demo block import.
            { type: 'import', value: DEMO_BLOCK_IMPORT + importStatement },
            ...others,
        ];

        // Transform JSX <pre> code demo in demo blocks.
        tree.children.filter(isPreJSXDemo).forEach((node) => {
            transformJSXCodeToJSXNode(importStatement, node);
        });
    };
};
