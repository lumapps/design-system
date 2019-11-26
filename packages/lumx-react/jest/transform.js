const CONFIGS = require('../../../configs');

module.exports = require('babel-jest').createTransformer({
    ...CONFIGS.babel,
    presets: ['@babel/preset-react', ...CONFIGS.babel.presets],
});
