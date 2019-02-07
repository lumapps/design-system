const merge = require('webpack-merge');

const { absolutePath } = require('./utils');
const webpackDevConfig = require('./webpack.dev');

const webpackAngularJsConfig = {
    entry: {
        'angularjs.lumx': absolutePath('../src/angular-js.index.js'),
    },
    output: {
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
        libraryTarget: 'umd',
    },
};

module.exports = merge(webpackDevConfig, webpackAngularJsConfig);
