const CONFIGS = require('../../../configs');

module.exports = require('babel-jest').default.createTransformer({
    plugins: CONFIGS.babel.plugins,
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/react', '@babel/preset-typescript'],
});
