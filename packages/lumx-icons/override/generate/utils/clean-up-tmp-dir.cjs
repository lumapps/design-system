const fs = require('node:fs/promises');

const { GENERATED_TMP_DIR } = require('../constants.cjs');

/** Clean up the tmp dir */
const cleanUpTmpDir = () => fs.rm(GENERATED_TMP_DIR, { recursive: true, force: true });

module.exports = { cleanUpTmpDir };
