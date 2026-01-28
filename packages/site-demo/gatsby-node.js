/* eslint-disable */
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const lodash = require('lodash');
const { createFilePath } = require('gatsby-source-filesystem');
const generateJSONIconLibrary = require('@lumx/icons/override/generate/generate-icon-library.cjs');
const cleanExcerpt = require('./plugins/utils/cleanExcerpt');
const mdxUtils = require('./plugins/utils/mdxUtils');
const CONFIGS = require('../../configs');

/** Get page title from slug */
const slugToTitle = (slug) => lodash.startCase(lodash.last(slug.split('/').filter(Boolean)));

/** Create pages with metadata from parsed MDX content and MDX page template. */
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const pageTemplate = path.resolve('./src/templates/MDXPageTemplate.tsx');
    const result = await graphql(`
        {
            allMdx {
                edges {
                    node {
                        parent {
                            ... on File {
                                sourceInstanceName
                                relativeDirectory
                            }
                        }
                        excerpt(pruneLength: 200)
                        fields {
                            slug
                        }
                        tableOfContents
                        internal {
                            contentFilePath
                        }
                    }
                }
            }
        }
    `);
    if (result.errors) {
        throw result.errors;
    }

    const pages = result.data.allMdx.edges.filter(
        (edge) => edge.node.parent && edge.node.parent.sourceInstanceName === 'preprocessed-content',
    );
    for (const page of pages) {
        const slug = page.node.fields?.slug;
        if (!slug) {
            continue;
        }
        const title = mdxUtils.getFirstH1Text(page.node.tableOfContents) || slugToTitle(slug);
        const excerpt = cleanExcerpt(page.node.excerpt, title);

        createPage({
            path: slug,
            component: `${pageTemplate}?__contentFilePath=${page.node.internal.contentFilePath}`,
            context: { slug, title, excerpt },
        });
    }
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

exports.onCreateBabelConfig = ({ actions }) => {
    actions.setBabelPreset({
        name: `@babel/preset-react`,
        options: {
            runtime: 'automatic',
        },
    });
};

exports.onCreateWebpackConfig = async ({ actions, stage }) => {
    if (!stage.endsWith('html')) {
        // Generate the JSON icon library
        await generateJSONIconLibrary();
    }

    actions.setWebpackConfig({
        plugins: [CONFIGS.ignoreNotFoundExport],
        resolve: {
            plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.tsx'] })],
        },
        module: {
            rules: [
                // Load .vue files as raw text
                {
                    test: /\.vue$/,
                    use: 'raw-loader',
                },
            ],
        },
    });
};
