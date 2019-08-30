const { get, partition, flatMap } = require('lodash');

/**
 * Combine import statements and jsx code into a formatted sample code for documentation.
 * @param  {string} importStatement Import statements.
 * @param  {string} code JSX code.
 * @return {string} The formatted sample code.
 */
const getSourceCode = (importStatement, code) => {
    return `${importStatement}\nconst App = ${code.trim()}`.trim().replace(/\n/g, '\\n');
};

/**
 * Transform <pre> element with JSX code into a demo block jsx element.
 * @param  {string} importStatement Import statements.
 * @param  {string} node JSX node.
 * @return {Object} JSX node containing the demo block.
 */
function createDemoBlock(importStatement, node) {
    const codeNode = node.children[0];
    const withThemeSwitcher = Boolean(codeNode.properties.withThemeSwitcher);
    const disableGrid = Boolean(codeNode.properties.disableGrid);
    const code = codeNode.children[0].value;
    const sourceCode = getSourceCode(importStatement, code);

    return {
        type: 'jsx',
        properties: node.properties,
        position: node.position,
        value: `
        <div>
            <DemoBlock withThemeSwitcher={${withThemeSwitcher}} disableGrid={${disableGrid}} sourceCode={\`${sourceCode}\`}>
                {${code.trim().replace(/;$/, '')}}
            </DemoBlock>
        </div>
    `,
    };
}

const isJSXImport = (node) => node.type === 'import';
const isPreImport = (node) =>
    node.type === 'element' && node.tagName === 'pre' && get(node, ['children', 0, 'properties', 'import']);
const isImport = (node) => isJSXImport(node) || isPreImport(node);

const isPreJSXDemo = (node) =>
    node.type === 'element' && node.tagName === 'pre' && get(node, ['children', 0, 'properties', 'jsx']);
const ADDITIONAL_IMPORT = `
import { DemoBlock } from 'LumX/demo/react/layout/DemoBlock';
import { propsByComponent } from 'props-loader!';
import { PropTable } from 'LumX/demo/react/layout/PropTable';
`;

/**
 * Create prop table section for each imported component.
 *
 * @param  {Array}  lumxImports list of LumX imported elements.
 * @return {Object} The JSX node for the prop table section.
 */
function createPropSection(lumxImports) {
    return {
        type: 'jsx',
        value: `
            <h2>Properties</h2>
            ${lumxImports
                .map(
                    (component) => `
                {('${component}' in propsByComponent) && (
                    <>
                        <h3>${component}</h3>
                        <PropTable propertyList={propsByComponent['${component}']} />
                    </>
                )}
            `,
                )
                .join('')}
        `,
    };
}

/**
 * Recursively browse a node to replace '\n' in text node by '</br>' elements.
 *
 * @param  {Object} node Node to transform.
 * @return {Object} New transformed node.
 */
function replaceNewLineWithBreakLine(node) {
    if (node.type === 'element') {
        return {
            ...node,
            children: flatMap(node.children, (child) => {
                if (child.type === 'element') {
                    // Recurse.
                    return replaceNewLineWithBreakLine(child);
                }
                if (child.type === 'text' && child.value) {
                    // Split text by new line.
                    const parts = child.value.split(/\n/g);

                    return flatMap(parts, (part, index) => {
                        // Creat new text node for each line.
                        const res = [{ ...child, value: part }];

                        // Interleave with `</br>` elements.
                        if (index < parts.length - 1) {
                            res.push({
                                type: 'element',
                                tagName: 'br',
                            });
                        }

                        return res;
                    });
                }

                return child;
            }),
        };
    }

    return node;
}

/**
 * MDX plugin to extract and insert source code from demo block in MDX documents.
 * @return {Function} The code extractor function.
 */
module.exports = () => {
    return (tree) => {
        const [importNodes, others] = partition(tree.children, isImport);
        const lumxImports = [];

        // Accumulate import statements.
        let importStatement = '';
        importNodes.forEach((node) => {
            const importCode = isJSXImport(node) ? node.value : get(node, ['children', 0, 'children', 0, 'value']);

            const matches = importCode.match(/import { (.*) } from 'LumX'/);
            if (matches) {
                lumxImports.push(...matches[1].split(/,\s*/).filter(Boolean));
            }

            importStatement += importCode;
        });

        tree.children = [
            // Group all imports at the top with demo block import.
            { type: 'import', value: ADDITIONAL_IMPORT + importStatement },

            /*
             * Transform content.
             *
             * - Transforms JSX PRE code block into demo block.
             * - Transforms paragraph replacing new lines with break lines.
             */
            ...others.map((node) => {
                if (isPreJSXDemo(node)) {
                    return createDemoBlock(importStatement, node);
                }
                if (node.tagName === 'p') {
                    return replaceNewLineWithBreakLine(node);
                }

                return node;
            }),
        ];

        if (lumxImports.length > 0) {
            tree.children.push(createPropSection(lumxImports));
        }
    };
};
