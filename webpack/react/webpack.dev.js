const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DEMO_PATH, SRC_PATH, TECH_PREFIX } = require('../constants');
const { getWebpackDevServerConfig } = require('../utils');

const webpackBaseConfig = require('../webpack.config');

const webpackDevConfig = {
    cache: true,

    devServer: getWebpackDevServerConfig({ port: 4001 }),

    devtool: 'cheap-eval-source-map',

    entry: {
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.react}/index.tsx`,
    },

    mode: 'development',

    output: {
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: `${DEMO_PATH}/${TECH_PREFIX.react}/public/index.html`,
        }),
    ],
    resolve: {
        alias: {
            '@lumx/core': `${SRC_PATH}/${TECH_PREFIX.react}.index.ts`,
        },
    },
};

module.exports = merge(webpackBaseConfig, webpackDevConfig);
