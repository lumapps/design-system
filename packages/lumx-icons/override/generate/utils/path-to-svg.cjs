// SVG path to SVG
function pathToSVG(path) {
    return `<svg viewBox="0 0 24 24"><path d="${path.trim()}"/></svg>`;
}

module.exports = { pathToSVG };
