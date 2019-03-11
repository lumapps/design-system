const merge = require('webpack-merge');

// Const { getComponents } = require('../utils');
const { SRC_PATH, TECH_PREFIX } = require('../constants');

const baseConfig = require('../webpack.config');

const reactConfig = {
    entry: {
        'lumx.react': `${SRC_PATH}/${TECH_PREFIX.react}.index.ts`,
        // ...getComponents({ prefix: TECH_PREFIX.react, extension: '[t|j]sx?' }),
    },
};

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
})(baseConfig, reactConfig);
