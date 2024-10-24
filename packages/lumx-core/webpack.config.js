/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-extraneous-dependencies */

const IS_CI = require('is-ci');
const path = require('path');
const glob = require('glob');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackNotifierPlugin = require('webpack-notifier');

const CONFIGS = require('../../configs');

const PKG_NAME = '@lumx/core';
const PKG_PATH = path.resolve(__dirname, './');
const SRC_PATH = `${PKG_PATH}/src`;
const DIST_PATH = `${PKG_PATH}/dist`;

const filename = '[name].min';

const minimizer = [
    new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: CONFIGS.terser,
    }),
];

const plugins = [
    /* Clean output. */
    new CleanWebpackPlugin(),

    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
    new ExtractCssChunks({
        chunkFilename: `${filename}.css`,
        filename: `${filename}.css`,
    }),
    new UnminifiedWebpackPlugin(),
    new CopyWebpackPlugin([
        {
            from: `${CONFIGS.path.ROOT_PATH}/CONTRIBUTING.md`,
            to: `${DIST_PATH}/`,
        },
        {
            from: `${CONFIGS.path.ROOT_PATH}/LICENSE.md`,
            to: `${DIST_PATH}/`,
        },
        {
            from: `${PKG_PATH}/package.json`,
            to: `${DIST_PATH}/`,
        },
        {
            context: SRC_PATH,
            from: `${SRC_PATH}/css`,
            to: `${DIST_PATH}/css`,
        },
        {
            context: SRC_PATH,
            from: `${SRC_PATH}/js`,
            to: `${DIST_PATH}/js`,
        },
        {
            context: SRC_PATH,
            from: `${SRC_PATH}/scss`,
            to: `${DIST_PATH}/scss`,
        },
    ]),
    new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: CONFIGS.cssNano,
        cssProcessorPluginOptions: {
            preset: [
                'default',
                {
                    discardComments: {
                        removeAll: true,
                    },
                    calc: false,
                    reduceTransforms: false,
                    minifySelectors: false,
                },
            ],
        },
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: `LumX - ${PKG_NAME} Package`,
        }),
    );
}

const cssLoaders = [
    {
        loader: ExtractCssChunks.loader,
        options: {
            hot: false,
            reloadAll: false,
        },
    },
    {
        loader: 'css-loader',
        options: {
            // eslint-disable-next-line no-magic-numbers
            importLoaders: 2,
            sourceMap: false,
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            config: {
                path: `${PKG_PATH}/postcss.config.js`,
            },
            sourceMap: false,
        },
    },
];

module.exports = {
    entry: {
        lumx: `${SRC_PATH}/scss/lumx.scss`,

        // Compile all JS/TS files.
        ...Object.fromEntries(
            glob
                .sync(`${SRC_PATH}/js/**/*.{js,ts}`)
                .map((file) => [path.relative(SRC_PATH, file).replace(new RegExp(`${path.extname(file)}$`), ''), file]),
        ),
    },

    externals: ['moment', 'moment-range'],

    bail: true,
    devtool: 'source-map',
    mode: 'production',
    name: PKG_NAME,

    resolve: {
        extensions: ['.js', '.ts'],
    },

    module: {
        rules: [
            {
                test: /\.scss$/u,
                use: [
                    ...cssLoaders,
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.css$/u,
                use: cssLoaders,
            },
            {
                exclude: /node_modules/u,
                test: /\.[j|t]sx?$/u,
                use: {
                    loader: 'babel-loader',
                    options: CONFIGS.babel,
                },
            },
        ],
    },

    output: {
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        path: DIST_PATH,
    },

    plugins,

    optimization: {
        minimize: true,
        minimizer,
    },

    stats: {
        colors: !IS_CI,
    },
};
