/* eslint-disable global-require, import/no-commonjs, import/unambiguous */
module.exports = {
    babel: require('./babel.config'),
    htmlMinifier: require('./html-minifier.config'),
    postcss: require('./postcss.config'),
    cssNano: require('./css-nano.config'),
    terser: require('./terser.config'),
    path: require('./path'),
};
