/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-extraneous-dependencies */

const IS_CI = require('is-ci');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackNotifierPlugin = require('webpack-notifier');

const CONFIGS = require('../../configs');

const PKG_NAME = '@lumx/angularjs';
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
    new UnminifiedWebpackPlugin(),
    new CopyWebpackPlugin([
        {
            from: `${CONFIGS.path.ROOT_PATH}/CONTRIBUTING.md`,
            to: DIST_PATH,
        },
        {
            from: `${CONFIGS.path.ROOT_PATH}/LICENSE.md`,
            to: DIST_PATH,
        },
        {
            from: `${PKG_PATH}/README.md`,
            to: DIST_PATH,
        },
        {
            from: `${PKG_PATH}/package.json`,
            to: DIST_PATH,
        },
    ]),
    new HtmlMinifierPlugin(CONFIGS.htmlMinifier),
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
        'lumx.angularjs': `${SRC_PATH}/index.js`,
    },

    externals: [
        'angularjs',
        {
            jquery: {
                commonjs: 'jquery',
                amd: 'jquery',
                root: '$',
            },
        },
    ],

    bail: true,
    devtool: 'source-map',
    mode: 'production',
    name: PKG_NAME,

    module: {
        rules: [
            {
                exclude: /node_modules/u,
                test: /\.[j|t]sx?$/u,
                use: {
                    loader: 'babel-loader',
                    options: CONFIGS.babel,
                },
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            [PKG_NAME]: SRC_PATH,
            // Use un-compiled code.
            '@lumx/core': '@lumx/core/src',
        },
    },

    output: {
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        path: DIST_PATH,
        library: {
            root: 'LumX',
            amd: PKG_NAME,
            commonjs: PKG_NAME,
        },
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },

    plugins,

    optimization: {
        minimize: true,
        minimizer,
    },

    stats: {
        colors: !IS_CI,
    },

    performance: {
        assetFilter: (file) => file.endsWith('.min.js'),
    },
};
