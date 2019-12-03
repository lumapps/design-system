const { get, partition, fromPairs, camelCase } = require('lodash');
const path = require('path');
const fs = require('fs');

const demoBlockRX = /<DemoBlock([^>]*?)\/?>((?:\n|.)*(?=<\/\s*DemoBlock>))?/;
const extractPropRX = /(\w+)(=\{([^}]+)\}|=("[^"]+"))?/g;

/**
 * Read source code to string (or return null if source code not found).
 * @param resourceFolder Base folder.
 * @param sourcePath     Relative path to source code.
 * @return {string|null} Source code.
 */
function readSourceCode(resourceFolder, sourcePath) {
    try {
        // eslint-disable-next-line no-sync
        const buffer = fs.readFileSync(path.resolve(resourceFolder, sourcePath));

        return JSON.stringify(buffer && buffer.toString());
    } catch (exception) {
        return null;
    }
}

function buildNewDemoBlock(node, propsIndex = {}, imports = []) {
    return {
        newNode: {
            ...node,
            value: `<DemoBlock ${Object.entries(propsIndex)
                .map(([name, value]) => (value ? `${name}=${value}` : name))
                .join(' ')} />`,
        },
        imports,
    };
}

function getDemoFromChildren(node, children) {
    const propsIndex = {
        engine: '"react"',
        children: `{<>${children}</>}`,
        code: `{{
            react: {
               code: ${JSON.stringify(`\n${children}`)}
            }
        }}`,
    };

    return buildNewDemoBlock(node, propsIndex);
}

function getDemoFromProps(resourceFolder, node, propsIndex) {
    const demoName = propsIndex.demo.replace(/"/g, '');

    const reactCodePath = `./react/${demoName}.tsx`;
    const reactCode = readSourceCode(resourceFolder, reactCodePath);
    const reactDemoVar = `react${camelCase(demoName)}`;
    const importReact = `import * as ${reactDemoVar} from '${reactCode ? reactCodePath : 'null-loader'}';`;

    const angularCodePath = `./angularjs/${demoName}.html`;
    const angularCode = readSourceCode(resourceFolder, angularCodePath);
    const angularDemoVar = `angular${camelCase(demoName)}`;
    const importAngular = `import * as ${angularDemoVar} from '${angularCode ? angularCodePath : 'null-loader'}';`;

    propsIndex.code = `{{
        react: {
           demo: ${reactDemoVar},
           code: ${reactCode}
        },
        angularjs: {
           demo: {
              controller: angularController,
              template: ${angularDemoVar},
           },
           code: ${angularCode}
        }
    }}`;

    return buildNewDemoBlock(node, propsIndex, [importReact, importAngular]);
}

/**
 * Update <DemoBlock/> props to import source code & inject the engine.
 * @param resourceFolder Current demo folder.
 * @param node           Current MDX node.
 * @return {{imports: [string, string], newNode: {value: string}}} Modified demo block with imports.
 */
function updateDemoBlock(resourceFolder, node) {
    const { value } = node;
    const match = value.match(demoBlockRX);

    const children = get(match, 2);
    if (children) {
        return getDemoFromChildren(node, children);
    }

    const propsString = get(match, 1);
    const props = propsString.match(extractPropRX);
    const propsIndex = fromPairs(props.map((prop) => prop.split('=')));
    if (propsIndex.demo) {
        return getDemoFromProps(resourceFolder, node, propsIndex);
    }

    return buildNewDemoBlock(node);
}

/**
 * Update <PropTable/> props to inject the engine.
 * @param  node     Current MDX node.
 * @return {Object} prop table.
 */
function updatePropTable(node) {
    return {
        ...node,
        value: node.value.replace('/>', 'engine={props.engine} />'),
    };
}

const isJSXImport = (node) => node.type === 'import';
const isPreImport = (node) =>
    node.type === 'element' && node.tagName === 'pre' && get(node, ['children', 0, 'properties', 'import']);
const isImport = (node) => isJSXImport(node) || isPreImport(node);

const ADDITIONAL_IMPORT = `
import { DemoBlock } from '@lumx/demo/layout/DemoBlock';
import { PropTable } from '@lumx/demo/layout/PropTable';
`;

const isDemoBlock = (node) => node.type === 'jsx' && node.value.match(demoBlockRX);
const isPropTable = (node) => node.type === 'jsx' && node.value.includes('<PropTable');

/**
 * MDX plugin to extract and insert source code from demo block in MDX documents.
 * @param  {string}   resourcePath Currently loaded MDX path.
 * @return {Function} The code extractor function.
 */
module.exports = (resourcePath) => () => {
    const resourceFolder = path.dirname(resourcePath);
    const controllerPath = './angularjs/controller.js';
    // eslint-disable-next-line no-sync
    const hasController = fs.existsSync(path.resolve(resourceFolder, controllerPath));
    const importController = `import * as angularController from '${hasController ? controllerPath : 'null-loader'}';`;

    return (tree) => {
        const [importNodes, others] = partition(tree.children, isImport);

        // Accumulate import statements.
        let importStatement = '';
        importNodes.forEach((node) => {
            const importCode = isJSXImport(node) ? node.value : get(node, ['children', 0, 'children', 0, 'value']);
            importStatement += importCode;
        });

        let contentHasDemo = false;

        /*
         * Transforms DemoBlock to import the required code.
         */
        const content = others.map((node) => {
            if (isDemoBlock(node)) {
                contentHasDemo = true;
                const { newNode, imports } = updateDemoBlock(resourceFolder, node);
                importStatement += `\n${imports.join('\n')}`;

                return newNode;
            }

            if (isPropTable(node)) {
                return updatePropTable(node);
            }

            return node;
        });

        if (contentHasDemo) {
            importStatement += `\n${importController}`;
        }

        tree.children = [
            // Group all imports at the top with demo block import.
            { type: 'import', value: ADDITIONAL_IMPORT + importStatement },

            // Transformed content.
            ...content,
        ];
    };
};
