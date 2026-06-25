const fs = require('node:fs/promises');

const { optimizeSVG } = require('./optimize-svg.cjs');

// SVG file optimization
async function optimizeSVGFile(svgFilePath) {
    const svgString = String(await fs.readFile(svgFilePath));
    const optimized = optimizeSVG(svgString, {
        js2svg: {
            indent: 2,
            pretty: true,
        },
    });
    await fs.writeFile(svgFilePath, optimized.data);
}

module.exports = { optimizeSVGFile };
