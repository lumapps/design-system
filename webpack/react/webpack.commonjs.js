const merge = require('webpack-merge');

const { getComponents } = require('../utils');
const { SRC_PATH, TECH_PREFIX } = require('../constants');

const webpackBaseConfig = require('../webpack.config');

const webpackCommonJsConfig = {
    devtool: 'source-map',

    entry: {
        index: `${SRC_PATH}/${TECH_PREFIX.react}.index.jsx`,
        ...getComponents({ prefix: TECH_PREFIX.react, extention: 'jsx' }),
    },

    mode: 'development',

    output: {
        crossOriginLoading: 'anonymous',
        filename: 'commonjs/[name].js',
        libraryTarget: 'commonjs',
    },
};

module.exports = merge.smart(webpackBaseConfig, webpackCommonJsConfig);
