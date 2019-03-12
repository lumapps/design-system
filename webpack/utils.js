const glob = require('glob');

const has = require('lodash/has');

const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { shouldPrintComment } = require('babel-plugin-smart-webpack-import');

const { getAbsolutePath } = require('./common-utils');
const {
    APP_PATH,
    COMPONENTS_PATH,
    CONFIGS,
    CORE_PATH,
    DEFAULT_HOST,
    DEFAULT_PORT,
    EXAMPLES_PATH,
    TECH_PREFIX,
} = require('./constants');

/**
 * Setup Babel transpiler.
 *
 * @param  {Array}  [plugins] The plugins to use.
 * @param  {Array}  [presets] The presets to use.
 * @param  {Object} [options] The options to use.
 * @return {Object} The Babel configuration object.
 */
const babelSetup = ({ plugins = [], presets = [], options = {} } = {}) => {
    return {
        ...options,
        plugins: [
            ...plugins,
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining',
        ],
        presets: [
            ...presets,
            [
                '@babel/preset-env',
                {
                    loose: true,
                    targets: ['last 2 versions', 'ie >= 11'],
                    useBuiltIns: 'usage',
                },
            ],
        ],
        shouldPrintComment,
    };
};

/**
 * Returns all entry point for a given technology and prefix.
 *
 * @param  {string} prefix    The tech name (react|angularjs) to match correct path.
 * @param  {string} extension The file extension to match.
 * @return {Object} An object of all formatted matches to use in webpack config entry option with filename
 *                  as key and path as value.
 */
const getComponents = ({ prefix, extension }) => {
    const files = {};
    const matches = glob.sync(`${COMPONENTS_PATH}/**/${prefix}/**/*.${extension}`);
    const fileNameRegexp = `(?:.*)/(.*).${extension}`;

    matches.forEach((match) => {
        files[match.match(fileNameRegexp)[1]] = match;
    });

    return files;
};

/**
 * Get all sass ressource files which contains ressources to share across all scss files.
 *
 * @return {Array} The array of ressource files.
 */
function getSassRessourcesFiles() {
    const ressourceFileNames = ['_mixins', '_variables', '_color-palette', '_functions'];

    // Sets the paths to match according to https://github.com/isaacs/minimatch documentation.
    const pathToMatch = `${CORE_PATH}/style/**/+(${ressourceFileNames.join('|')}).scss`;

    return glob.sync(pathToMatch);
}

/**
 * Returns `WebpackDevServer` default config to use in dev mode.
 *
 * @param  {number} port The port we want to use.
 * @return {Object} The config object.
 */
function getWebpackDevServerConfig({ port } = {}) {
    return {
        compress: true,
        contentBase: APP_PATH,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
            index: '/',
        },
        host: DEFAULT_HOST,
        hot: true,
        open: true,
        overlay: true,
        port: port || DEFAULT_PORT,
        quiet: true,
    };
}

/**
 * Build the production configuration for the given tech in the given module type.
 *
 * @param  {Object} config         The configuration to use as the base configuration.
 * @param  {string} tech           The tech we want to build the package of.
 * .                               Possible values are: 'angularjs' or 'react'.
 * @param  {string} moduleType     The type of module we want to use for the build.
 *                                 Allowed values are the same as the Webpack `output.libraryTarget` ones (e.g. 'umd',
 *                                 'amd', 'commonjs', ...).
 *                                 See: https://webpack.js.org/guides/author-libraries/.
 * @param  {boolean} [minify=true] Indicates if you want to minify the bundle.
 * @return {Object} The built configuration for the production build.
 */
const buildConfig = (config, tech, moduleType, minify = true) => {
    if (!has(TECH_PREFIX, tech)) {
        throw new Error(`Unknown tech "${tech}"`);
    }

    const filename = `[name]${minify ? '.min' : ''}`;

    const minimizer = [];

    const plugins = [
        ...config.plugins,
        new ExtractCssChunks({
            chunkFilename: `${filename}.css`,
            filename: `${filename}.css`,
        }),
        new CopyWebpackPlugin([
            {
                from: `${EXAMPLES_PATH}/${tech}`,
                to: getAbsolutePath(`../dist/${tech}/examples/`),
            },
            {
                from: `${EXAMPLES_PATH}/styles.css`,
                to: getAbsolutePath(`../dist/${tech}/examples/`),
            },
            {
                from: `${EXAMPLES_PATH}/package.json`,
                to: getAbsolutePath('../dist/'),
            },
            {
                from: `${EXAMPLES_PATH}/README.md`,
                to: getAbsolutePath('../dist/'),
            },
        ]),
    ];
    if (minify) {
        plugins.push(new HtmlMinifierPlugin(CONFIGS.htmlMinifier));
        plugins.push(
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: CONFIGS.cssNano,
                cssProcessorPluginOptions: {},
            }),
        );

        minimizer.push(
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                terserOptions: CONFIGS.terser,
            }),
        );
    }

    return merge(config, {
        bail: true,

        devtool: 'source-map',
        mode: 'production',

        name: `${tech}-${moduleType}${minify ? '-minified' : ''}`,

        output: {
            ...config.output,
            chunkFilename: `${filename}.js`,
            filename: `${filename}.js`,
            library: {
                root: 'LumX',
                amd: `@lumx/${tech}`,
                commonjs: `@lumx/${tech}`,
            },
            libraryTarget: moduleType,
            path: getAbsolutePath(`../dist/${tech}`),
            sourceMapFilename: `${filename}.js.map`,
            umdNamedDefine: moduleType === 'umd' ? true : undefined,
        },

        plugins,

        optimization: {
            minimize: minify,
            minimizer,
        },
    });
};

module.exports = {
    babelSetup,
    buildConfig,
    getComponents,
    getSassRessourcesFiles,
    getWebpackDevServerConfig,
};
