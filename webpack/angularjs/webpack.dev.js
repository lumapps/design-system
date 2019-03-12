const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getWebpackDevServerConfig } = require('../utils');
const { DEMO_PATH, TECH_PREFIX } = require('../constants');

const angularJSConfig = require('./webpack.config');

const devConfig = {
    devServer: getWebpackDevServerConfig(),

    entry: {
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.angularjs}/app.js`,
    },

    plugins: [
        ...angularJSConfig.plugins,
        new ExtractCssChunks({
            chunkFilename: '[name].css',
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: `${DEMO_PATH}/${TECH_PREFIX.angularjs}/index.html`,
        }),
    ],
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(angularJSConfig, devConfig);
