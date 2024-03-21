const babelConfig = require('@lumx/babel-config');

module.exports = require('babel-jest').default.createTransformer(babelConfig.get({ platform: 'node', framework: 'react' }));
