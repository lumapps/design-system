const StyleDictionary = require('style-dictionary');

/**
 * Disabling some rules that can't be respected in auto-generated SCSS/CSS code.
 */
const DISABLE_COMMENT = `/* stylelint-disable custom-property-pattern, max-line-length, scss/dollar-variable-pattern */`;

/**
 * Wrap a format to prepend stylelint disable comment.
 */
module.exports = function(format) {
  const name = `${format}--stylelint-disable`;
  StyleDictionary.registerFormat({
    name,
    formatter(options) {
      const inputFormat = StyleDictionary.format[format](options);
      return `${DISABLE_COMMENT}\n\n${inputFormat}`;
    },
  });
  return name;
};
