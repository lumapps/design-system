/** Reverse of `cssCodeToUnicode` */
const unicodeToCssCode = (unicode) => `\\${unicode.toString(16).toUpperCase()}`;

module.exports = { unicodeToCssCode };
