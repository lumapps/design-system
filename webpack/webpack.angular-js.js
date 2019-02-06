const merge = require('webpack-merge');

const { absolutePath } = require('./utils');
const webpackBaseConfig = require('./webpack.config');

const webpackAngularJsConfig = {
    entry: { 'angularjs.lumx': absolutePath('../src/angular-js.index.js') },
};

module.exports = merge(webpackBaseConfig, webpackAngularJsConfig);
