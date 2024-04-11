const fs = require('node:fs');
const path = require('node:path');

const { INPUT_ICON_OVERRIDE_DIR } = require('./constants.cjs');
const { optimizeSVGFile } = require('./utils.cjs');

module.exports = async function optimizeSVGs() {
    console.debug('Optimizing SVG files...');

    const files = await fs.promises.readdir(INPUT_ICON_OVERRIDE_DIR);

    const svgFiles = files.filter((file) => file.endsWith('.svg'));

    await Promise.all(svgFiles.map((svgFile) => optimizeSVGFile(path.join(INPUT_ICON_OVERRIDE_DIR, svgFile))));
};
