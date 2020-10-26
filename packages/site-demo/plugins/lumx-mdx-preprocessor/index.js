const fs = require('fs');

const mdxDemoBlock = require('./mdx-demo-block');
const mdxPropTable = require('./mdx-prop-table');

exports.loadNodeContent = async (node) => {
    const buffer = await fs.promises.readFile(node.absolutePath, 'utf-8');

    let mdxString = buffer.toString();
    mdxString = await mdxDemoBlock(node.absolutePath, mdxString);
    mdxString = await mdxPropTable(mdxString);
    return mdxString;
};
