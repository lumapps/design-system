/** MDX AST utils */
const mdxUtils = {
    /** Extract raw text from MDX AST tree. */
    getText(node) {
        if (node && node.value) return node.value;
        return node && node.children && node.children.map(mdxUtils.getText).filter(Boolean).join(' ');
    },
    /** Extract raw text from the first H1 in tree. */
    getFirstH1Text(rootNode) {
        const firstH1 = rootNode.children.find((n) => n.type === 'heading' && n.depth === 1);
        return mdxUtils.getText(firstH1);
    },
};

module.exports = mdxUtils;
