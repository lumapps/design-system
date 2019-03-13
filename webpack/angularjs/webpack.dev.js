const merge = require('webpack-merge');

const { getDevConfig } = require('../webpack.dev.utils');
const { DEMO_PATH, TECH_PREFIX } = require('../constants');

const angularJSConfig = require('./webpack.config');

const devConfig = {
    entry: {
        'demo-site': `${DEMO_PATH}/${TECH_PREFIX.angularjs}/app.js`,
    },
};

module.exports = getDevConfig({
    config: merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
    })(angularJSConfig, devConfig),
    tech: TECH_PREFIX.angularjs,
});
