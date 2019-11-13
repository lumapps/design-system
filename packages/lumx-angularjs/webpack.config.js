/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-extraneous-dependencies */

const IS_CI = require('is-ci');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackNotifierPlugin = require('webpack-notifier');

const { CONFIGS, EXAMPLES_PATH, ROOT_PATH } = require('../../webpack/constants');
const { babelSetup } = require('../../webpack/utils');

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
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
    new UnminifiedWebpackPlugin(),
    new CopyWebpackPlugin([
        {
            from: `${EXAMPLES_PATH}/angularjs/`,
            to: `${DIST_PATH}/examples/`,
        },
        {
            from: `${EXAMPLES_PATH}/styles.css`,
            to: `${DIST_PATH}/examples/`,
        },
        {
            from: `${ROOT_PATH}/CONTRIBUTING.md`,
            to: DIST_PATH,
        },
        {
            from: `${ROOT_PATH}/LICENSE.md`,
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
            title: 'LumX - Angularjs Package',
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
    name: '@lumx/angularjs',

    module: {
        rules: [
            {
                test: /\.js$/u,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelSetup({ plugins: [['angularjs-annotate', { explicitOnly: true }]] }),
                    },
                ],
            },
            {
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },

    resolve: {
        alias: {
            '@lumx/angularjs': SRC_PATH,
        },
        modules: ['node_modules']
    },

    output: {
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        path: DIST_PATH,
        library: {
            root: 'LumX',
            amd: '@lumx/angularjs',
            commonjs: '@lumx/angularjs',
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
};
