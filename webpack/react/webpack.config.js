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
            '@lumx/react': path.resolve(__dirname, `${SRC_PATH}/react.index.ts`),
        },
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'resolve.alias': 'append',
})(baseConfig, reactConfig);
