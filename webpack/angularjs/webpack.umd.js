const merge = require('webpack-merge');

const { getBuildConfig } = require('../webpack.build.utils');
const { MINIFY: minify } = require('../constants');

const angularJSConfig = require('./webpack.config');

const UMDConfig = {};

module.exports = getBuildConfig({
    config: merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
    })(angularJSConfig, UMDConfig),
    tech: 'angularjs',
    moduleType: 'umd',
    minify,
});
