const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('../utils');
const { APP_PATH, DEFAULT_HOST, DEMO_PATH, SRC_PATH } = require('../constants');

const reactConfig = require('./webpack.config');

const devConfig = {
    entry: {
        'demo-site': `${DEMO_PATH}/react/index.tsx`,
    },

    resolve: {
        alias: {
            LumX: `${SRC_PATH}/react.index.ts`,
        },
    },
};

const plugins = [
    ...reactConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: '[name].css',
        filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
        inject: false,
        template: `${DEMO_PATH}/react/index.html`,
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: 'LumX - React - Development',
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
    'resolve.alias': 'append',
})(reactConfig, devConfig, {
    devServer: {
        compress: true,
        contentBase: APP_PATH,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
            index: '/',
        },
        host: DEFAULT_HOST,
        hot: true,
        open: true,
        overlay: true,
        // eslint-disable-next-line no-magic-numbers
        port: 4000,
        quiet: true,
    },
    entry: {
        'demo-theme-lumapps': `${DEMO_PATH}/style/lumapps.scss`,
        'demo-theme-material': `${DEMO_PATH}/style/material.scss`,
    },
    module: {
        rules: getStyleLoader({ mode: 'dev' }),
    },
    plugins,
});
