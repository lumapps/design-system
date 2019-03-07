const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const { getSassRessourcesFiles } = require('../utils');
const { CORE_PATH, NODE_MODULES_PATH, SRC_PATH, TECH_PREFIX } = require('../constants');

const webpackBaseConfig = require('../webpack.config');

const webpackAngularJSConfig = {
    cache: true,

    entry: {
        'angularjs.lumx': `${SRC_PATH}/${TECH_PREFIX.angularjs}.index.js`,
    },

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
            {
                exclude: /node_modules/u,
                test: /\.scss$/u,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: `${CORE_PATH}/style/postcss.config.js`,
                            },
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [`${NODE_MODULES_PATH}/sass-mq`],
                            sourceMap: false,
                        },
                    },
                    {
                        // TODO: Refactor all ressources in a `lumx-ressources` file and always import it when needed.
                        loader: 'sass-resources-loader',
                        options: {
                            resources: getSassRessourcesFiles(),
                        },
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
        new ExtractCssChunks({
            chunkFilename: '[name].css',
            filename: '[name].css',
        }),
    ],
};

module.exports = merge.smart(webpackBaseConfig, webpackAngularJSConfig);
