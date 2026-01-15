const fs = require('fs');
const path = require('path');
const mdxDemoBlock = require('./mdx-demo-block');
const mdxPropTable = require('./mdx-prop-table');

const CACHE_DIR = path.resolve(__dirname, '../../.cache/lumx-preprocessed-content');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Preprocess MDX files and write them to a cache directory for gatsby-plugin-mdx to pick up.
 */
exports.onCreateNode = async ({ node, reporter }) => {
    // Only process MDX files from the 'content' source
    if (node.internal.type === 'File' && node.ext === '.mdx' && node.sourceInstanceName === 'content') {
        try {
            // Read the original file content
            const buffer = await fs.promises.readFile(node.absolutePath, 'utf-8');
            let mdxString = buffer.toString();

            // Apply preprocessing
            mdxString = await mdxDemoBlock(node.absolutePath, mdxString);
            mdxString = await mdxPropTable(mdxString);

            // Determine path in cache directory
            // We maintain the relative path structure to avoid collisions
            const relativePath = node.relativePath;
            const cachePath = path.join(CACHE_DIR, relativePath);
            const cacheDir = path.dirname(cachePath);

            if (!fs.existsSync(cacheDir)) {
                await fs.promises.mkdir(cacheDir, { recursive: true });
            }

            // Write the preprocessed content
            await fs.promises.writeFile(cachePath, mdxString);
        } catch (e) {
            reporter.error(`Error preprocessing MDX file ${node.absolutePath}`, e);
        }
    }
};
