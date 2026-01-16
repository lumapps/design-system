const fs = require('fs');
const nodePath = require('path');
const lodash = require('lodash');
const YAML = require('yaml');

const debug = require('../utils/debug');
const { createFilePath } = require('gatsby-source-filesystem');
const { createContentDigest } = require('gatsby-core-utils');

function createMenuEntry({ parent, children, hasDynamicChildren = false, ...node }) {
    const path = node.path || nodePath.join(parent, lodash.kebabCase(node.label), '/');
    const label = node.label || lodash.upperFirst(lodash.startCase(nodePath.basename(path)).toLowerCase());
    return { id: path, path, label, children, hasDynamicChildren };
}

function addMenuEntry(createNode, menuEntry) {
    createNode({
        ...menuEntry,
        internal: { type: 'MenuEntry', contentDigest: createContentDigest(menuEntry) },
    });
    return menuEntry.path;
}

function addMDXAsMenuEntry(createNode, getNode, node) {
    const path = createFilePath({ node, getNode });
    if (getNode(path)) {
        // Menu entry already exists.
        return;
    }
    addMenuEntry(createNode, createMenuEntry({ path }));
}

exports.createSchemaCustomization = ({ actions }) => {
    actions.createTypes(`
        type MenuEntry implements Node {
          path: String
          label: String
          hasDynamicChildren: Boolean
        }
    `);
};

/** Load `content/menu.yml` and create a menu entry for each menu node. */
exports.sourceNodes = async ({ actions, getNode, getNodesByType }) => {
    try {
        // Create menu for each MDX content.
        getNodesByType('Mdx').forEach(lodash.partial(addMDXAsMenuEntry, actions.createNode, getNode));

        const data = await fs.promises.readFile(nodePath.resolve(__dirname, '../../content/menu.yml'));
        const entries = YAML.parse(data.toString());

        const addAllEntries = (parent, node) => {
            if (lodash.isString(node)) {
                return addMenuEntry(actions.createNode, createMenuEntry({ parent, label: node }));
            }
            const [[label, children]] = Object.entries(node);
            const menuEntry = createMenuEntry({ parent, label });

            return addMenuEntry(actions.createNode, {
                ...menuEntry,
                // List children paths.
                children: Array.isArray(children) && children.map(lodash.partial(addAllEntries, menuEntry.path)),
                // The list of children is not preloaded.
                hasDynamicChildren: children === '*',
            });
        };

        addAllEntries('', { '/': entries });
    } catch (e) {
        debug(e);
    }
};

/** Create menu entry for each MDX content. */
exports.onCreateNode = ({ node, actions: { createNode }, getNode }) => {
    try {
        if (node.internal.type === 'Mdx') {
            addMDXAsMenuEntry(createNode, getNode, node);
        }
    } catch (e) {
        debug(e);
    }
};
