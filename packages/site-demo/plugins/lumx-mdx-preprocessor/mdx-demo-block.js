const { camelCase, partial } = require('lodash');
const path = require('path');
const fs = require('fs');

const CONTENT_DIR = path.resolve('./content');
const rewriteJSXComponents = require('../utils/rewriteJSXComponents');
const debug = require('../utils/debug');

/** Read source code to string (or return null if source code not found). */
async function readSourceCode(sourcePath) {
    try {
        const buffer = await fs.promises.readFile(sourcePath);
        return buffer.toString();
    } catch (exception) {
        console.warn(`Could not load demo in '${path.relative(CONTENT_DIR, sourcePath)}'`);
        return null;
    }
}

// Remove first level indent on code (if found).
const removeIndent = (code) => {
    const indentMatch = code.match(/^\n?(\s+)/);
    if (!indentMatch) return code;
    return code.trim().replace(new RegExp(`\n${indentMatch[1]}`, 'g'), '\n')
}

// Use a regular expression to remove curly braces at the start and end
function removeCurlyBracesFromJSX(code) {
    return code.replace(/^\{|\}$/g, '');
}

/** Update <DemoBlock/> props to import source code. */
async function updateDemoBlock(resourceFolder, addImport, props) {
    if (props.children) {
        // <DemoBlock> with children already have a demo inside them.
        // We copy the demo as string into the `codeString` prop.
        props.codeString = JSON.stringify(removeCurlyBracesFromJSX(removeIndent(props.children)));
        return props;
    }

    if (!props.demo) {
        // Nothing to do.
        return props;
    }

    const demoName = props.demo.replace(/"/g, '');
    let relativeSourcePath = `./react/${demoName}.tsx`;
    let sourcePath = path.join(resourceFolder, relativeSourcePath);
    let isVue = false;

    // Check if React demo exists, if not, check for Vue demo.
    try {
        await fs.promises.access(sourcePath);
    } catch (e) {
        const vueRelativeSourcePath = `./vue/${demoName}.vue`;
        const vueSourcePath = path.join(resourceFolder, vueRelativeSourcePath);
        try {
            await fs.promises.access(vueSourcePath);
            relativeSourcePath = vueRelativeSourcePath;
            sourcePath = vueSourcePath;
            isVue = true;
        } catch (vueE) {
            // Neither exists, fall back to React path (will fail gracefully in readSourceCode)
        }
    }

    // Get demo code.
    const code = await readSourceCode(sourcePath);
    if (!code) {
        return props;
    }
    props.codeString = JSON.stringify(code.trim());

    // Import demo (will be added at the top).
    let relativePath = path.relative(CONTENT_DIR, sourcePath);
    const demoVar = camelCase(`demo-${relativePath.replace('/', '-')}`);
    
    if (isVue) {
        addImport("import { VueComponentWrapper } from '@lumx/demo/components/content/VueComponentWrapper';");
        addImport(`import * as ${demoVar} from '@content/${relativePath}';`);
        // Wrap in curly braces to treat as a JS expression that returns a function
        props.children = `{({ theme }) => <VueComponentWrapper component={${demoVar}.default} theme={theme} />}`;
    } else {
        addImport(`import * as ${demoVar} from '@content/${relativePath}';`);
        // Add demo as children.
        props.children = `{Object.values(${demoVar}).find(v => typeof v === 'function')}`;
    }

    return props;
}

/**
 * MDX plugin to extract and insert source code from demo block in MDX documents.
 */
module.exports = async (filePath, mdxString) => {
    try {
        const resourceFolder = path.dirname(filePath);
        const imports = [];
        const addImport = (i) => {
            if (!imports.includes(i)) {
                imports.push(i);
            }
        };

        // Rewrite demo blocks.
        mdxString = await rewriteJSXComponents(
            'DemoBlock',
            mdxString,
            partial(updateDemoBlock, resourceFolder, addImport)
        );

        if (imports.length) {
            // Inject imports at the top.
            mdxString = `${imports.join('\n')}\n\n${mdxString}`;
        }

        return mdxString;
    } catch (e) {
        debug(e);
    }
};

// Test code indent remove
if (require.main === module) {
    (async () => {
        const props = await updateDemoBlock(
            '.',
            () => undefined,
            { children: '    Foo\n    Bar'}
        );
        console.debug(props);
    })();
}
