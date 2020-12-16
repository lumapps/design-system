const CONFIGS = require('../../../configs');

module.exports = require('ts-jest').createTransformer({
    plugins: CONFIGS.babel.plugins,
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/react', '@babel/preset-typescript'],
});
