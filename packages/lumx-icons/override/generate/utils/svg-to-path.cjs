const { DOMParser } = require('@xmldom/xmldom');

// SVG to SVG path
function svgToPath(svgString) {
    const svgDOM = new DOMParser().parseFromString(svgString, 'text/string');
    const svg = Array.from(svgDOM.childNodes).find(child => child.nodeName.toLowerCase() === 'svg');
    const paths = svg && Array.from(svg.childNodes).filter(child => child.nodeName.toLowerCase() === 'path');
    const path = paths?.length === 1 && paths[0]
    if (!path) {
        throw new Error('SVG must contain exactly one `<path d="..." />` element.');
    }
    const d = Array.from(path.attributes).find(({ name }) => name === 'd')?.value;
    if (!d) {
        throw new Error(`SVG path does not have a \`d="..."\` attribute`);
    }
    return d;
}

module.exports = { svgToPath };
