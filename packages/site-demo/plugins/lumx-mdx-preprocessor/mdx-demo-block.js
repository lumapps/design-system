const path = require('path');
const fs = require('fs');
const { createContentDigest } = require('gatsby-core-utils');

const CONTENT_DIR = path.resolve('./content');
const CACHE_DIR = path.resolve(__dirname, '../../.cache/lumx-preprocessed-content');

/**
 * MDX plugin to extract and insert source code from demo block in MDX documents.
 */
module.exports = async (filePath, mdxString) => {
    // Determine the location of the MDX file relative to content root
    // e.g. product/components/avatar/index.mdx
    const relativePath = path.relative(CONTENT_DIR, filePath);
    const relativeDir = path.dirname(relativePath);

    // The directory where we will store demos for this MDX file
    // e.g. .cache/lumx-preprocessed-content/product/components/avatar/demos/
    const demoCacheDir = path.join(CACHE_DIR, relativeDir, 'demos');

    const imports = [];

    // Regex to match code blocks with "demo" meta
    // ```language demo prop="value"
    // content
    // ```
    // Capture groups: 1: language, 2: props, 3: content
    // Note: We use [^\n]* to match props to avoid matching across newlines if \s includes \n
    const codeBlockRegex = /```([a-z0-9]+)\s+demo([^\n]*)\n([\s\S]*?)```/g;

    const demoFileWritePromises = [];

    const editedMdxString = mdxString.replace(codeBlockRegex, (fullMatch, lang, propsStr, content) => {
        const hash = createContentDigest(content);
        const demoFilename = `${hash}.tsx`;
        const demoFilePath = path.join(demoCacheDir, demoFilename);

        // Create directory if not exists
        if (!fs.existsSync(demoCacheDir)) {
            fs.mkdirSync(demoCacheDir, { recursive: true });
        }

        // Write the demo file
        demoFileWritePromises.push(fs.promises.writeFile(demoFilePath, content.trim()));

        // Generate import statement
        // import Demo_<hash> from './demos/<hash>';
        const componentName = `Demo_${hash}`;
        imports.push(`import ${componentName} from './demos/${hash}';`);

        const codeString = JSON.stringify(content.trim());
        const props = propsStr.trim();

        // Construct <DemoBlock> replacement
        // <DemoBlock codeString={...} orientation="horizontal">{Demo_<hash>}</DemoBlock>
        return `<DemoBlock codeString={${codeString}} ${props}>{${componentName}}</DemoBlock>`;
    });

    await Promise.all(demoFileWritePromises);

    if (imports.length > 0) {
        return `${imports.join('\n')}\n\n${editedMdxString}`;
    }

    return editedMdxString;
};
