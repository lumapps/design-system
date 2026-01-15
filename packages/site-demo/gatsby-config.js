/* eslint-disable */
const packageJson = require('./package.json');
const getParentTitlePath = require('./plugins/utils/getParentTitlePath');
const extractTextFromHTMLPage = require('./plugins/utils/extractTextFromHTMLPage');
const path = require('path');

module.exports = {
    siteMetadata: {
        title: 'LumApps Design System',
        author: packageJson.author.name,
        description: packageJson.description,
        version: packageJson.version,
    },
    plugins: [
        // Load content source files.
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/content`,
                name: 'content',
            },
        },
        // Copy static content files.
        {
            resolve: 'gatsby-plugin-copy-files-enhanced',
            options: {
                source: `${__dirname}/content`,
                destination: '/',
            },
        },
        // Parse DemoBlock and PropTable.
        './lumx-mdx-preprocessor',
        // Compile MDX content.
        {
            resolve: 'gatsby-plugin-mdx',
            options: {
                extensions: ['.mdx', '.md'],
                // Skip `File` node to process on `ProcessedMdxFile` nodes created by `lumx-mdx-preprocessor`.
                shouldBlockNodeFromTransformation: (node) => node.internal.type === 'File',

                gatsbyRemarkPlugins: [
                    // Replaces “dumb” punctuation marks with “smart” punctuation marks.
                    'gatsby-remark-smartypants',
                    // Generate anchor for each heading.
                    {
                        resolve: 'gatsby-remark-autolink-headers',
                        options: { icon: false },
                    },
                ],

                rehypePlugins: [
                    // Insert <br> on MDX \n.
                    require('./plugins/lumx-rehype-break-line'),
                ],
            },
        },
        // Load menu entries from `content/menu.yml` and MDX files.
        './lumx-menu',
        // Compile SASS.
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                implementation: require('sass'),
                postCssPlugins: require('./postcss.config').plugins,
            },
        },
        // Prevent styles from being squashed into a single CSS file.
        'gatsby-plugin-split-css',
        // LunR search indexing
        {
            resolve: `./lumx-lunr-search`,
            options: {
                filename: 'search_index.json',
                getDocumentsForTypes: {
                    // Index site page with at least a title.
                    async SitePage({ context = {} }) {
                        const { title, slug } = context;
                        if (!title) return;
                        let content;
                        if (process.env.NODE_ENV === 'production') {
                            // In PROD, extract text from the generated page HTML.
                            content = await extractTextFromHTMLPage(
                                title,
                                path.resolve(path.join(__dirname, 'public', slug, 'index.html')),
                            );
                        } else {
                            // In DEV, just use an excerpt.
                            content = context.excerpt;
                        }
                        const parentTitlePath = getParentTitlePath(context);
                        return { title, content, slug, parentTitlePath };
                    },
                },
                fields: [
                    { name: 'title', index: true, store: true, attributes: { boost: 20 } },
                    { name: 'content', index: true, store: true },
                    { name: 'slug', index: false, store: true },
                    { name: 'parentTitlePath', index: false, store: true },
                ],
            },
        },
    ],
};
