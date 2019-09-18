const merge = require('webpack-merge');

const baseConfig = require('../webpack.config');

const coreConfig = {};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
    'resolve.alias': 'append',
})(baseConfig, coreConfig);
