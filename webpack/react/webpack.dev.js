const merge = require('webpack-merge');

const { getDevConfig } = require('../webpack.dev.utils');
const { DEMO_PATH, SRC_PATH, TECH_PREFIX } = require('../constants');

const reactConfig = require('./webpack.config');

const devConfig = {
    entry: {
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.react}/index.tsx`,
    },

    resolve: {
        alias: {
            LumX: `${SRC_PATH}/${TECH_PREFIX.react}.index.ts`,
        },
    },
};

module.exports = getDevConfig({
    config: merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
        'resolve.alias': 'append',
    })(reactConfig, devConfig),
    tech: TECH_PREFIX.react,
    // eslint-disable-next-line no-magic-numbers
    devServerPort: 4001,
});
