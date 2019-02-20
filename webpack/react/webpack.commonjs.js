const merge = require('webpack-merge');

const { babelSetup, getComponents } = require('../utils');
const { SRC_PATH, TECH_PREFIX } = require('../constants');

const webpackBaseConfig = require('../webpack.config');

const webpackCommonJsConfig = {
    devtool: 'source-map',

    entry: {
        index: `${SRC_PATH}/${TECH_PREFIX.react}.index.jsx`,
        ...getComponents({ prefix: TECH_PREFIX.react, extention: 'jsx' }),
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
        filename: 'commonjs/[name].js',
        libraryTarget: 'commonjs',
    },
};

module.exports = merge(webpackBaseConfig, webpackCommonJsConfig);
