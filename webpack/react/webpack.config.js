const merge = require('webpack-merge');

const { SRC_PATH, TECH_PREFIX } = require('../constants');

const baseConfig = require('../webpack.config');

const reactConfig = {
    entry: {
        'lumx.react': `${SRC_PATH}/${TECH_PREFIX.react}.index.ts`,
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, reactConfig);
