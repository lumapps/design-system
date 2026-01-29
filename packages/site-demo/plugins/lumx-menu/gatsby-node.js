const fs = require('fs');
const nodePath = require('path');
const lodash = require('lodash');
const YAML = require('yaml');

const debug = require('../utils/debug');
const { createFilePath } = require('gatsby-source-filesystem');
const { createContentDigest } = require('gatsby-core-utils');

function createMenuEntry({ parent, children, hasDynamicChildren = false, frameworks, ...node }) {
    const path = node.path || nodePath.join(parent, lodash.kebabCase(node.label), '/');
    const label = node.label || lodash.upperFirst(lodash.startCase(nodePath.basename(path)).toLowerCase());
    const menuEntry = { id: path, path, label, children, hasDynamicChildren };
    if (frameworks) menuEntry.frameworks = frameworks;
    return menuEntry;
}

/** Create menu entry node, merging with existing if present (preserves MDX fields like frameworks) */
function addMenuEntry({ actions, getNode, menuEntry }) {
    const existingNode = getNode?.(menuEntry.path);
    const mergedEntry = existingNode ? { ...existingNode, ...menuEntry } : menuEntry;
    actions.createNode({
        ...mergedEntry,
        internal: { type: 'MenuEntry', contentDigest: createContentDigest(mergedEntry) },
    });
    return menuEntry.path;
}

function addMDXAsMenuEntry({ actions, getNode, node }) {
    const path = createFilePath({ node, getNode });
    const mdxNode = getNode(node.id);
    const frameworks = mdxNode.frontmatter?.frameworks;
    const menuEntry = createMenuEntry({ path, frameworks });

    // Merge with existing node if present (preserves menu.yml fields like hasDynamicChildren)
    addMenuEntry({ actions, getNode, menuEntry });
}

exports.createSchemaCustomization = ({ actions }) => {
    actions.createTypes(`
        type MenuEntry implements Node {
          path: String
          label: String
          hasDynamicChildren: Boolean
          frameworks: [String]
        }
    `);
};

/** Load `content/menu.yml` and create a menu entry for each menu node. */
exports.sourceNodes = async ({ actions, getNode, getNodesByType }) => {
    try {
        // Create menu for each MDX content.
        for (const node of getNodesByType('Mdx')) {
            addMDXAsMenuEntry({ actions, getNode, node });
        }

        const data = await fs.promises.readFile(nodePath.resolve(__dirname, '../../content/menu.yml'));
        const entries = YAML.parse(data.toString());

        const addAllEntries = (parent, node) => {
            const isStringNode = lodash.isString(node);
            const label = isStringNode ? node : Object.keys(node)[0];
            const children = isStringNode ? undefined : Object.values(node)[0];
            const menuEntry = createMenuEntry({ parent, label });

            // Build entry data from menu.yml
            const entryData = {
                ...menuEntry,
                children: Array.isArray(children) && children.map((child) => addAllEntries(menuEntry.path, child)),
                hasDynamicChildren: children === '*',
            };

            // Merge with existing node if present (preserves frameworks from MDX)
            return addMenuEntry({ actions, getNode, menuEntry: entryData });
        };

        addAllEntries('', { '/': entries });
    } catch (e) {
        debug(e);
    }
};

/** Create menu entry for each MDX content. */
exports.onCreateNode = ({ node, actions, getNode }) => {
    try {
        if (node.internal.type === 'Mdx') {
            addMDXAsMenuEntry({ actions, getNode, node });
        }
    } catch (e) {
        debug(e);
    }
};
