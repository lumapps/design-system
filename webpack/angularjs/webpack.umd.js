const merge = require('webpack-merge');

const { TECH_PREFIX } = require('../constants');

const { getBuildConfig } = require('../webpack.build.utils');

const angularJSConfig = require('./webpack.config');

const UMDConfig = {};

module.exports = getBuildConfig({
    config: merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
    })(angularJSConfig, UMDConfig),
    tech: TECH_PREFIX.angularjs,
    moduleType: 'umd',
});
