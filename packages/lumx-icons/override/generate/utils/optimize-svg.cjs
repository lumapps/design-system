const svgo = require('svgo');

// SVG optimization: multi-pass with reduced float precision
function optimizeSVG(svgString, options) {
    return svgo.optimize(svgString, { multipass: true, floatPrecision: 2, ...options });
}

module.exports = { optimizeSVG };
