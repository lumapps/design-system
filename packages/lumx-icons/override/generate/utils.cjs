const fs = require('fs/promises');
const { GENERATED_TMP_DIR } = require('./constants.cjs');

/** Convert CSS character code (ex: /F0544) to integer unicode code point (ex: 984388) */
const cssCodeToUnicode = (cssCode) => parseInt(cssCode.replace(/^\\/, ''), 16);

/** Clean up the tmp dir */
const cleanUpTmpDir = () => fs.rm(GENERATED_TMP_DIR, { recursive: true, force: true });

module.exports = { cssCodeToUnicode, cleanUpTmpDir };
