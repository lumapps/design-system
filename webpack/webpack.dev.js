const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { absolutePath } = require('./utils');
const webpackAngularJsConfig = require('./webpack.angular-js');

const webpackDevConfig = {
    cache: true,

    devServer: {
        compress: true,
        contentBase: absolutePath('../'),
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        host: '0.0.0.0',
        hot: true,
        port: 4000,
    },

    devtool: 'cheap-module-source-map',

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            template: 'demo/index.html',
        }),
    ],
};

module.exports = merge(webpackAngularJsConfig, webpackDevConfig);
