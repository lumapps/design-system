module.exports = require('babel-jest').createTransformer(
    require('../../webpack/utils').babelSetup({ presets: ['@babel/preset-react'] }),
);
