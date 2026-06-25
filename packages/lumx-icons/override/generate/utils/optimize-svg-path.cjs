const { pathToSVG } = require('./path-to-svg.cjs');
const { optimizeSVG } = require('./optimize-svg.cjs');
const { svgToPath } = require('./svg-to-path.cjs');

/** Use svgo to optimize a SVG path */
function optimizeSVGPath(path) {
    // To SVG
    const svgString = pathToSVG(path);
    // Optimize
    const result = optimizeSVG(svgString);
    // To SVG path
    return svgToPath(result.data);
}

module.exports = { optimizeSVGPath };
