const fs = require('fs');
const path = require('path');
const processDemo = require('./mdx-demo-block');
const processPropTable = require('./mdx-prop-table');

const CACHE_DIR = path.resolve(__dirname, '../../.cache/lumx-preprocessed-content');

exports.onPreInit = ({ reporter }) => {
    if (fs.existsSync(CACHE_DIR)) {
        fs.rmSync(CACHE_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    reporter.info(`Cleared and recreated cache dir: ${CACHE_DIR}`);
};

exports.onCreateNode = async ({ node, actions, reporter }) => {
    if (node.sourceInstanceName !== 'raw-content') return;

    // Only process .tsx files in the content directory (demos) or .mdx files
    const isDemo = node.internal.type === 'File' && node.ext === '.tsx';
    const isDemoVue = node.internal.type === 'File' && node.ext === '.vue';
    const isMDX = node.internal.type === 'File' && node.ext === '.mdx';

    if (!isDemo && !isDemoVue && !isMDX) return;

    // Check if it's in the content directory
    if (!node.absolutePath.includes('/content/')) return;

    try {
        const content = await fs.promises.readFile(node.absolutePath, 'utf-8');
        let processedContent = content;

        if (isDemo) {
            processedContent = await processDemo(content);
        } else if (isMDX) {
            processedContent = await processPropTable(content);
        }

        const relativePath = node.relativePath;
        const outputPath = path.join(CACHE_DIR, relativePath);

        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, processedContent);
    } catch (e) {
        reporter.error(`Error processing ${node.absolutePath}`, e);
    }
};
