const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DEMO_PATH, SRC_PATH, TECH_PREFIX } = require('../constants');
const { getWebpackDevServerConfig } = require('../utils');

const webpackBaseConfig = require('../webpack.config');

const webpackDevConfig = {
    cache: true,

    devServer: getWebpackDevServerConfig(),
    devtool: 'cheap-module-source-map',

    entry: {
        'angularjs.lumx': `${SRC_PATH}/${TECH_PREFIX.angularjs}.index.js`,
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.angularjs}/app.js`,
    },

    mode: 'development',

    module: {
        rules: [
            {
                exclude: /index.html/,
                test: /\.(html)$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },

    output: {
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
        libraryTarget: 'umd',
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: `${DEMO_PATH}/${TECH_PREFIX.angularjs}/index.html`,
        }),
    ],
};

module.exports = merge(webpackBaseConfig, webpackDevConfig);
