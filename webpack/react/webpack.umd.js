const merge = require('webpack-merge');

const { buildConfig } = require('../utils');
const { MINIFY } = require('../constants');

const reactConfig = require('./webpack.config');

const UMDConfig = {};

module.exports = buildConfig(
    merge.smartStrategy({
        entry: 'replace',
        'module.rules': 'append',
        plugins: 'replace',
    })(reactConfig, UMDConfig),
    'react',
    'umd',
    MINIFY,
);
