const merge = require('webpack-merge');

const { TECH_PREFIX } = require('../constants');

const { getBuildConfig } = require('../webpack.build.utils');

const reactConfig = require('./webpack.config');

const UMDConfig = {};

module.exports = getBuildConfig({
    config: merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
    })(reactConfig, UMDConfig),
    tech: TECH_PREFIX.react,
    moduleType: 'umd',
});
