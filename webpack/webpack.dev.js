const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { absolutePath } = require('./utils');
const webpackBaseConfig = require('./webpack.config');

const webpackDevConfig = {
    cache: true,

    entry: {
        'demo-site': absolutePath('../demo/angular-js/app.js'),
    },

    devServer: {
        compress: true,
        contentBase: absolutePath('../'),
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
            index: '/',
        },
        host: '0.0.0.0',
        hot: true,
        port: 4000,
    },

    devtool: 'cheap-module-source-map',

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            template: 'demo/angular-js/index.html',
        }),
    ],
};

module.exports = merge(webpackBaseConfig, webpackDevConfig);
