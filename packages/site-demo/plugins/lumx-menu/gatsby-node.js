const fs = require('fs');
const nodePath = require('path');
const lodash = require('lodash');
const YAML = require('yaml');

const { createFilePath } = require('gatsby-source-filesystem');

function createMenuEntry({ parent, ...node }) {
    const path = node.path || nodePath.join(parent, lodash.kebabCase(node.label), '/');
    const label = node.label || lodash.upperFirst(lodash.startCase(nodePath.basename(path)).toLowerCase());
    const isRoot = Boolean(path.match(/^\/[^/]+\/$/));
    return { ...node, path, label, id: path, isRoot };
}

function addMenuEntry(createNode, createContentDigest, menuEntry) {
    createNode({
        ...menuEntry,
        internal: { type: 'MenuEntry', contentDigest: createContentDigest(menuEntry) },
    });
    return menuEntry.path;
}

/** Load `content/menu.yml` and create a menu entry for each menu node. */
exports.sourceNodes = async ({ actions, createContentDigest }) => {
    const data = await fs.promises.readFile(nodePath.resolve(__dirname, '../../content/menu.yml'));
    const entries = YAML.parse(data.toString());

    const format = (parent, node) => {
        if (lodash.isString(node)) {
            return createMenuEntry({ parent, label: node }).path;
        }
        const [[label, children]] = Object.entries(node);
        const menuEntry = createMenuEntry({ parent, label });

        return addMenuEntry(actions.createNode, createContentDigest, {
            ...menuEntry,
            // List children paths.
            children: Array.isArray(children) && children.map(lodash.partial(format, menuEntry.path)),
            // The list of children is not preloaded.
            hasDynamicChildren: children === '*',
        });
    };

    entries.forEach(lodash.partial(format, '/'));
};

/** Create menu entry for each MDX content. */
exports.onCreateNode = ({ node, actions, getNode, createContentDigest }) => {
    if (node.internal.type === 'Mdx') {
        addMenuEntry(
            actions.createNode,
            createContentDigest,
            createMenuEntry({
                path: createFilePath({ node, getNode }),
            }),
        );
    }
};
