const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('../utils');
const { COMPONENTS_PATH, CONFIGS, CORE_PATH, DIST_PATH, ROOT_PATH } = require('../constants');

const coreConfig = require('./webpack.config');

const minify = Boolean(process.env.MINIFY);
const generatePackage = Boolean(process.env.GENERATE_PACKAGE);

const filename = `[name]${minify ? '.min' : ''}`;

const minimizer = [];
const plugins = [
    ...coreConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: `${filename}.css`,
        filename: `${filename}.css`,
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: `LumX - Core - ${minify ? 'Minified package' : 'Package'}`,
        }),
    );
}

if (generatePackage) {
    plugins.push(
        new CopyWebpackPlugin([
            {
                from: `${ROOT_PATH}/CONTRIBUTING.md`,
                to: `${DIST_PATH}/core/`,
            },
            {
                from: `${ROOT_PATH}/LICENSE.md`,
                to: `${DIST_PATH}/core/`,
            },
            {
                from: `${CORE_PATH}/package.json`,
                to: `${DIST_PATH}/core/`,
            },
            {
                from: `${CORE_PATH}/constants.js`,
                to: `${DIST_PATH}/core/js`,
            },
            {
                from: `${CORE_PATH}/utils.js`,
                to: `${DIST_PATH}/core/js`,
            },
            {
                from: `${CORE_PATH}/custom-colors.js`,
                to: `${DIST_PATH}/core/js`,
            },
            {
                context: `${CORE_PATH}/style/`,
                from: `${CORE_PATH}/style/*.scss`,
                to: `${DIST_PATH}/core/scss`,
            },
            {
                context: `${CORE_PATH}/style/`,
                from: { glob: `${CORE_PATH}/style/**/*.scss`, ignore: [`${CORE_PATH}/style/*`] },
                to: `${DIST_PATH}/core/scss/core`,
            },
            {
                context: `${COMPONENTS_PATH}/`,
                from: `${COMPONENTS_PATH}/**/style/**/*.scss`,
                to: `${DIST_PATH}/core/scss/components`,
                transformPath: (targetPath) => targetPath.replace('/style/', '/'),
            },
        ]),
    );
    plugins.push(
        new ReplaceInFileWebpackPlugin([
            {
                dir: `${DIST_PATH}/core/scss`,
                rules: [
                    {
                        search: /'\.\/(base|elevation|grid|input|link|size|spacing|state|theme|typography)/g,
                        replace: "'./core/$1",
                    },
                    {
                        search: /'\.\.\/\.\.\/components/g,
                        replace: "'./components",
                    },
                    {
                        search: /\/style/g,
                        replace: '',
                    },
                ],
            },
        ]),
    );
}

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

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
    output: 'replace',
})(coreConfig, {
    bail: true,
    devtool: minify ? 'source-map' : '',
    mode: 'production',
    name: `core-umd${minify ? '-minified' : ''}`,

    module: {
        rules: getStyleLoader({ mode: 'prod' }),
    },

    output: {
        ...coreConfig.output,
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        library: {
            root: 'LumX',
            amd: '@lumx/core',
            commonjs: '@lumx/core',
        },
        libraryTarget: 'umd',
        path: `${DIST_PATH}/core`,
        sourceMapFilename: minify ? `${filename}.js.map` : undefined,
        umdNamedDefine: true,
    },

    plugins,

    optimization: {
        minimize: minify,
        minimizer,
    },
});
