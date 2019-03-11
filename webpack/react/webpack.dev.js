const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getWebpackDevServerConfig } = require('../utils');
const { DEMO_PATH, SRC_PATH, TECH_PREFIX } = require('../constants');

const reactConfig = require('./webpack.config');

const devConfig = {
    // eslint-disable-next-line no-magic-numbers
    devServer: getWebpackDevServerConfig({ port: 4001 }),

    entry: {
        ...reactConfig.entry,
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.react}/index.tsx`,
    },

    plugins: [
        ...reactConfig.plugins,
        new ExtractCssChunks({
            chunkFilename: '[name].css',
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: `${DEMO_PATH}/${TECH_PREFIX.react}/public/index.html`,
        }),
    ],

    resolve: {
        alias: {
            LumX: `${SRC_PATH}/${TECH_PREFIX.react}.index.ts`,
        },
    },
};

module.exports = merge.smartStrategy({
    entry: 'replace',
    'module.rules': 'append',
    plugins: 'replace',
    'resolve.alias': 'append',
})(reactConfig, devConfig);
