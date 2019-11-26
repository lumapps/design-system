/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-extraneous-dependencies */

const IS_CI = require('is-ci');
const path = require('path');

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
            from: `${SRC_PATH}/*.js`,
            to: `${DIST_PATH}/js`,
        },
        {
            context: SRC_PATH,
            from: `${SRC_PATH}/**/*.scss`,
            to: `${DIST_PATH}/scss`,
        },
    ]),
    new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: CONFIGS.cssNano,
        cssProcessorPluginOptions: {},
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

module.exports = {
    entry: {
        'lumx-theme-lumapps': `${SRC_PATH}/lumx-theme-lumapps.scss`,
        'lumx-theme-material': `${SRC_PATH}/lumx-theme-material.scss`,
    },

    bail: true,
    devtool: 'source-map',
    mode: 'production',
    name: PKG_NAME,

    module: {
        rules: [
            {
                test: /\.scss$/u,
                use: [
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
                use: [
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
                ],
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
