const CONFIGS = require('../../../configs');

module.exports = require('ts-jest').createTransformer(CONFIGS.babel);
