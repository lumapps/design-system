const fs = require('node:fs/promises');
const util = require('node:util');
const _exec = util.promisify(require('node:child_process').exec);

const svgo = require('svgo');
const { DOMParser } = require('@xmldom/xmldom');
const upperFirst = require('lodash/upperFirst');

const { GENERATED_TMP_DIR } = require('./constants.cjs');
const { ROOT_PATH } = require('../../../../configs/path');

/** Convert CSS character code (ex: /F0544) to integer unicode code point (ex: 984388) */
const cssCodeToUnicode = (cssCode) => parseInt(cssCode.replace(/^\\/, ''), 16);

/** Reverse of `cssCodeToUnicode` */
const unicodeToCssCode = (unicode) => `\\${unicode.toString(16).toUpperCase()}`;

/** Clean up the tmp dir */
const cleanUpTmpDir = () => fs.rm(GENERATED_TMP_DIR, { recursive: true, force: true });

async function exec(cmd) {
    try {
        await _exec(cmd, { cwd: ROOT_PATH });
    } catch ({ stderr, stdout }) {
        console.error(stdout.toString(), stderr.toString());
    }
}

// SVG optimization: multi-pass with reduced float precision
function optimizeSVG(svgString, options) {
    return svgo.optimize(svgString, { multipass: true, floatPrecision: 2, ...options });
}

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

// SVG path to SVG
function pathToSVG(path) {
    return `<svg viewBox="0 0 24 24"><path d="${path.trim()}"/></svg>`;
}

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

/** Use svgo to optimize a SVG path */
function optimizeSVGPath(path) {
    // To SVG
    const svgString = pathToSVG(path);
    // Optimize
    const result = optimizeSVG(svgString);
    // To SVG path
    return svgToPath(result.data);
}

/** Format from raw name ('ex: 'printer-3d') to JS mdi name (ex: 'mdiPrinter3d'). */
const formatMdiName = name => `mdi${name.split('-').map(upperFirst).join('')}`;

module.exports = {
    unicodeToCssCode,
    cssCodeToUnicode,
    cleanUpTmpDir,
    exec,
    optimizeSVGFile,
    optimizeSVG,
    optimizeSVGPath,
    pathToSVG,
    svgToPath,
    formatMdiName,
};
