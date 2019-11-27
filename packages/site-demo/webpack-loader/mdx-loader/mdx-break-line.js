const { flatMap } = require('lodash');

/**
 * Recursively browse a node to replace '\n' in text node by '</br>' elements.
 *
 * @param  {Object} node Node to transform.
 * @return {Object} New transformed node.
 */
function replaceNewLineWithBreakLine(node) {
    if (node.type === 'text' && node.value) {
        // Split text by new line.
        const parts = node.value.split(/\n/g);

        return flatMap(parts, (part, index) => {
            // Creat new text node for each line.
            const res = [{ ...node, value: part }];

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

    if (node.type === 'element' && node.tagName === 'p') {
        return {
            ...node,
            children: flatMap(node.children, replaceNewLineWithBreakLine),
        };
    }

    return node;
}

/**
 * Replace `\n` with break line.
 */
module.exports = () => {
    return (tree) => {
        tree.children = tree.children.map(replaceNewLineWithBreakLine);
    };
};
