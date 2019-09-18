const path = require('path');

const merge = require('webpack-merge');

const { SRC_PATH } = require('../constants');

const { babelSetup } = require('../utils');
const baseConfig = require('../webpack.config');

const reactConfig = {
    entry: {
        'lumx.react': `${SRC_PATH}/react.index.ts`,
    },

    resolve: {
        alias: {
            LumX: path.resolve(__dirname, `${SRC_PATH}/react.index.ts`),
        },
    },

    resolveLoader: {
        alias: {
            'props-loader': path.resolve(__dirname, 'props-loader'),
            'mdx-loader': path.resolve(__dirname, 'mdx-loader'),
        },
    },

    module: {
        rules: [
            {
                test: /\.(mdx|md)?$/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelSetup({
                            presets: ['@babel/preset-react'],
                        }),
                    },
                    {
                        loader: 'mdx-loader',
                    },
                ],
            },
        ],
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    'resolve.alias': 'append',
    'resolveLoader.alias': 'append',
})(baseConfig, reactConfig);
