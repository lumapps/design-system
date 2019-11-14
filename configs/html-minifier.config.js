/**
 * HTML Minifier options.
 *
 * @type {Object}
 * @see [HTMLMinifier documentation]{@link https://www.npmjs.com/package/html-minifier#options-quick-reference}
 */
module.exports = {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    customAttrCollapse: /ng-class/,
    customEventAttributes: [/^(on|ng)[a-z]{3,}$/],
    html5: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    processScripts: ['text/ng-template'],
    quoteCharacter: '"',
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
};
