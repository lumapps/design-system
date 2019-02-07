const { absolutePath, babelSetup, getSassRessourcesFiles } = require('./utils');

const webpackBaseConfig = {
    module: {
        rules: [
            {
                exclude: /(instance-scripts|node_modules)/u,
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
                            sourceMap: false,
                            config: {
                                path: absolutePath('../src/core/style/postcss.config.js'),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            includePaths: [absolutePath('../node_modules/sass-mq')],
                        },
                    },
                    {
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
    },

    target: 'web',
};

module.exports = webpackBaseConfig;
