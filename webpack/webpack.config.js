const path = require('path');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { babelSetup, getSassRessourcesFiles } = require('./utils');
const { COMPONENTS_PATH, CORE_PATH, NODE_MODULES_PATH, ICONS_PATH } = require('./constants');

const webpackBaseConfig = {
    entry: {
        'style-material': `${CORE_PATH}/style-material/index.js`,
    },
    module: {
        rules: [
            {
                exclude: /node_modules/u,
                test: /\.js$/u,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelSetup(),
                    },
                ],
            },
            {
                exclude: /node_modules/u,
                test: /\.jsx$/u,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelSetup({
                            presets: ['@babel/preset-react'],
                        }),
                    },
                ],
            },
            {
                exclude: /node_modules/u,
                test: /\.ts(x)?$/u,
                loader: 'awesome-typescript-loader',
                options: {
                    silent: true,
                },
            },
            {
                exclude: /node_modules/u,
                test: /\.scss$/u,
                use: [
                    { loader: 'style-loader' },
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

    plugins: [new WebpackBar(), new FriendlyErrorsWebpackPlugin()],

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', 'json'],
        modules: ['node_modules'],
        alias: {
            'LumX/icons': path.resolve(__dirname, `${ICONS_PATH}/index.js`),
            'LumX/angularjs': path.resolve(__dirname, `${CORE_PATH}/angularjs`),
            'LumX/react': path.resolve(__dirname, `${CORE_PATH}/react`),
            'LumX/core': path.resolve(__dirname, CORE_PATH),
            'LumX/components': path.resolve(__dirname, COMPONENTS_PATH),
        },
    },

    target: 'web',
};

module.exports = webpackBaseConfig;
