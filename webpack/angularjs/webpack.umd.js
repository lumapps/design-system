const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { CONFIGS } = require('../constants');

const webpackAngularJSBaseConfig = require('./webpack.angularjs');

const MINIFY = false;

const plugins = [
    ...webpackAngularJSBaseConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: '[name].css',
        filename: '[name].css',
    }),
];
const output = {
    ...webpackAngularJSBaseConfig.output,
    chunkFilename: '[name].js',
    sourceMapFilename: '[name].js.map',
};

const minimizer = [];
if (MINIFY) {
    plugins.push(new HtmlMinifierPlugin(CONFIGS.htmlMinifier));
    plugins.push(
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: CONFIGS.cssNano,
            cssProcessorPluginOptions: {},
        }),
    );

    minimizer.push(
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            terserOptions: CONFIGS.terser,
        }),
    );
}

const webpackDevConfig = {
    devtool: 'source-map',
    mode: 'production',

    plugins,
    output,

    optimization: {
        ...webpackAngularJSBaseConfig.optimization,
        minimize: MINIFY,
        minimizer,
    },
};

module.exports = merge.smart(webpackAngularJSBaseConfig, webpackDevConfig);
