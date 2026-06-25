/** Format from raw name ('ex: 'printer-3d') to JS mdi name (ex: 'mdiPrinter3d'). */
const formatMdiName = name => `mdi${name.replace(/(^|-)(\w)/g, (_, _sep, c) => c.toUpperCase())}`;

module.exports = { formatMdiName };
