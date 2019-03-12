const merge = require('webpack-merge');

const { buildConfig } = require('../utils');
const { MINIFY } = require('../constants');

const angularJSConfig = require('./webpack.config');

const UMDConfig = {};

module.exports = buildConfig(
    merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
    })(angularJSConfig, UMDConfig),
    'angularjs',
    'umd',
    MINIFY,
);
