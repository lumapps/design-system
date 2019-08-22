const path = require('path');

const merge = require('webpack-merge');

const { SRC_PATH } = require('../constants');

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
        }
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    'resolve.alias': 'append',
    'resolveLoader.alias': 'append',
})(baseConfig, reactConfig);
