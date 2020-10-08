/**
 * Replace inlineCode elements with code elements
 */
function replaceInlineCode(node) {
    if (node.tagName === 'inlineCode') {
        return { ...node, tagName: 'code' };
    }
    if (node.children) {
        return { ...node, children: node.children.map(replaceInlineCode) };
    }
    return node;
}

module.exports = () => (tree) => {
    tree.children = tree.children.map(replaceInlineCode);
};
