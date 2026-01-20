/* eslint-disable */
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

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
    const result = await graphql(
        `
            {
                allMdx {
                    edges {
                        node {
                            excerpt(pruneLength: 200)
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
        const slug = page.node.fields.slug;
        const title = mdxUtils.getFirstH1Text(page.node.mdxAST) || slugToTitle(slug);
        const excerpt = cleanExcerpt(page.node.excerpt, title);
        createPage({
            path: slug,
            component: pageTemplate,
            context: { slug, title, excerpt },
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

exports.onCreateBabelConfig = ({ actions }) => {
    actions.setBabelPreset({
        name: `@babel/preset-react`,
        options: {
            runtime: 'automatic',
        },
    })
}

exports.onCreateWebpackConfig = async ({ actions, getConfig }) => {
    // Generate the JSON icon library
    await generateJSONIconLibrary();

    actions.setWebpackConfig({
        plugins: [
            CONFIGS.ignoreNotFoundExport,
            new VueLoaderPlugin(),
        ],

        resolve: {
            alias: {
                '@content': path.resolve('./content'),
                'vue$': 'vue/dist/vue.esm-bundler.js',
            },
            plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.tsx', '.vue'] })],
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.ts$/,
                    include: [
                        path.resolve(__dirname, '../lumx-vue'),
                        path.resolve(__dirname, 'content'),
                    ],
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
                        ],
                    },
                },
            ],
        },
    });

    // Add `workerize-loader` to simplify loading Web Workers with standard `import`
    const config = getConfig();
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'workerize-loader', options: { inline: true } },
    });
    actions.replaceWebpackConfig(config);
};
