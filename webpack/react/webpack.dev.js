const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DEMO_PATH, TECH_PREFIX } = require('../constants');
const { babelSetup, getWebpackDevServerConfig } = require('../utils');

const webpackBaseConfig = require('../webpack.config');

const webpackDevConfig = {
    cache: true,

    devServer: getWebpackDevServerConfig({ port: 4001 }),

    devtool: 'cheap-module-source-map',

    entry: {
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.react}/index.jsx`,
    },

    mode: 'development',

    module: {
        rules: [
            {
                exclude: /node_modules/u,
                test: /\.jsx$/u,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelSetup({ presets: ['@babel/preset-react'] }),
                    },
                ],
            },
        ],
    },

    output: {
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: `${DEMO_PATH}/${TECH_PREFIX.react}/public/index.html`,
        }),
    ],
};

module.exports = merge(webpackBaseConfig, webpackDevConfig);
