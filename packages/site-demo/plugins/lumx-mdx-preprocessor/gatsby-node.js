/**
 * Derive MDX files into a new node to be loaded by `gatsby-plugin-mdx` via `loadNodeContent` defined in `index.js`.
 */
exports.onCreateNode = ({ actions, node }) => {
    if (node.internal.type === 'File' && node.ext === '.mdx') {
        // Derive the `File` node into a new node owned by this plugin.
        const type = 'PreprocessedMdxFile';
        actions.createNode({
            parent: node.id,
            internal: {
                type,
                contentDigest: node.internal.contentDigest + type,
                mediaType: 'text/x-markdown',
            },
            id: node.id + type,
            absolutePath: node.absolutePath,
        });
    }
};
