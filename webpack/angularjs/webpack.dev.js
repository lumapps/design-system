const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DEMO_PATH, TECH_PREFIX } = require('../constants');
const { getWebpackDevServerConfig } = require('../utils');

const webpackAngularJSBaseConfig = require('./webpack.angularjs');

const entry = {
    ...webpackAngularJSBaseConfig.entry,
    'demo-site': `${DEMO_PATH}/${TECH_PREFIX.angularjs}/app.js`,
};
const plugins = [
    ...webpackAngularJSBaseConfig.plugins,
    new HtmlWebpackPlugin({
        inject: false,
        template: `${DEMO_PATH}/${TECH_PREFIX.angularjs}/index.html`,
    }),
];
const output = { ...webpackAngularJSBaseConfig.output };

const webpackDevConfig = {
    devServer: getWebpackDevServerConfig(),
    devtool: 'cheap-module-source-map',
    mode: 'development',

    entry,
    plugins,
    output,
};

module.exports = merge.smart(webpackAngularJSBaseConfig, webpackDevConfig);
