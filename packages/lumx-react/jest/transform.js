const babelConfig = require('@lumx/babel-config');

module.exports = require('babel-jest').default.createTransformer({
    ...babelConfig.get(),
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/react', '@babel/preset-typescript'],
});
