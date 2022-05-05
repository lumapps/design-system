/* eslint-disable */
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const lodash = require('lodash');
const { createFilePath } = require('gatsby-source-filesystem');

const CONFIGS = require('../../configs');

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const pageTemplate = path.resolve('./src/templates/MDXPageTemplate.tsx');
    const result = await graphql(
        `
            {
                allMdx {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            mdxAST
                        }
                    }
                }
            }
        `,
    );
    if (result.errors) {
        throw result.errors;
    }

    const pages = result.data.allMdx.edges;
    pages.forEach((page) => {
        const firstH1 = page.node.mdxAST.children.find((n) => n.type === 'heading' && n.depth === 1);
        createPage({
            path: page.node.fields.slug,
            component: pageTemplate,
            context: {
                slug: page.node.fields.slug,
                firstH1: firstH1 && lodash.get(firstH1, ['children', 0, 'value']),
            },
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    if (node.internal.type === 'Mdx') {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: 'slug',
            node,
            value,
        });
    }
};

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        plugins: [CONFIGS.ignoreNotFoundExport],

        resolve: {
            alias: {
                '@content': path.resolve('./content'),
            },
            plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.tsx'] })],
        },
    });
};
