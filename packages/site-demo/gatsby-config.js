/* eslint-disable */
const packageJson = require('./package.json');

module.exports = {
    siteMetadata: {
        title: 'LumApps Design System',
        author: packageJson.author.name,
        description: packageJson.description,
        version: packageJson.version,
    },
    pathPrefix: '__PATH_PREFIX__',
    plugins: [
        // Inject path prefix at runtime (detected with a RegExp pattern).
        {
            resolve: 'gatsby-plugin-swarm',
            options: {
                prefix: '__PATH_PREFIX__',
                pattern: /^(\/lumapps-[^/]+)/,
            },
        },
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
        // Update document head using react.
        'gatsby-plugin-react-helmet',
        // Compile SASS.
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                postCssPlugins: [require('./postcss.config')],
            },
        },
        // Prevent styles from being squashed into a single CSS file.
        'gatsby-plugin-split-css',
    ],
};
