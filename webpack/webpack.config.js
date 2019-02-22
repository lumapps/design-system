const { babelSetup, getSassRessourcesFiles } = require('./utils');
const { CORE_PATH, NODE_MODULES_PATH, ICONS_PATH } = require('./constants');

const webpackBaseConfig = {
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

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules'],
        alias: {
            '@lumx/icons': `${ICONS_PATH}/index.js`,
            core: CORE_PATH,
        },
    },

    target: 'web',
};

module.exports = webpackBaseConfig;
