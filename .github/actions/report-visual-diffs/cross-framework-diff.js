const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

const { findFiles, extractRelativePath, normalizeScreenshotPath } = require('./utils');

const DIFF_PIXELS_THRESHOLD = 30;

/**
 * Align two PNG images to the same dimensions by padding the smaller one.
 * Follows the vitest-plugin-vis approach: out-of-bounds pixels become semi-transparent black.
 *
 * @param {{ data: Buffer, width: number, height: number }} img1
 * @param {{ data: Buffer, width: number, height: number }} img2
 * @returns {[{ data: Buffer, width: number, height: number }, { data: Buffer, width: number, height: number }]}
 */
function alignImages(img1, img2) {
    if (img1.width === img2.width && img1.height === img2.height) {
        return [img1, img2];
    }

    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);

    const resize = (image) => {
        if (image.width === width && image.height === height) {
            return image;
        }
        // Buffer.alloc zero-fills, so out-of-bounds pixels start as (0,0,0,0).
        const buf = Buffer.alloc(width * height * 4);
        const srcRowBytes = image.width * 4;
        const dstRowBytes = width * 4;
        // Copy existing rows using Buffer.copy (much faster than pixel-by-pixel)
        for (let y = 0; y < image.height; y++) {
            image.data.copy(buf, y * dstRowBytes, y * srcRowBytes, y * srcRowBytes + srcRowBytes);
        }
        // Fill out-of-bounds alpha to 64 (semi-transparent black) for visibility
        for (let y = 0; y < height; y++) {
            for (let x = y < image.height ? image.width : 0; x < width; x++) {
                buf[(width * y + x) * 4 + 3] = 64;
            }
        }
        return { data: buf, width, height };
    };

    return [resize(img1), resize(img2)];
}

/**
 * Compare two PNG files and produce a diff image.
 *
 * @param {string} reactPath - Path to react screenshot PNG
 * @param {string} vuePath - Path to vue screenshot PNG
 * @param {string} diffPath - Path to write the diff PNG
 * @returns {{ diffPixels: number, diffPercent: number, totalPixels: number, hasDiff: boolean }}
 */
function compareImages(reactPath, vuePath, diffPath) {
    const img1 = PNG.sync.read(fs.readFileSync(reactPath));
    const img2 = PNG.sync.read(fs.readFileSync(vuePath));

    const [aligned1, aligned2] = alignImages(img1, img2);
    const { width, height } = aligned1;

    const diff = new PNG({ width, height });
    const diffPixels = pixelmatch(aligned1.data, aligned2.data, diff.data, width, height, {
        threshold: 0.1,
    });

    const totalPixels = width * height;
    const diffPercent = totalPixels > 0 ? (diffPixels / totalPixels) * 100 : 0;
    const hasDiff = diffPixels > DIFF_PIXELS_THRESHOLD;

    if (hasDiff) {
        fs.mkdirSync(path.dirname(diffPath), { recursive: true });
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }

    return { diffPixels, diffPercent, totalPixels, hasDiff };
}

/**
 * Main entry point for cross-framework visual diff.
 *
 * @param {Object} params
 * @param {string} params.reactDir - Path to the React screenshots directory (containing __results__/__baselines__)
 * @param {string} params.vueDir - Path to the Vue screenshots directory (containing __results__/__baselines__)
 * @param {string} params.outputDir - Path to write the diff output
 */
async function main({ reactDir, vueDir, outputDir }) {
    console.log('Cross-framework visual diff: scanning screenshots...');

    // Check both directories exist
    for (const dir of [reactDir, vueDir]) {
        try {
            await fsPromises.access(dir);
        } catch {
            console.log(`Directory not found: ${dir}. Skipping cross-framework diff.`);
            return;
        }
    }

    // Find all screenshot PNGs in each directory (__results__ preferred, __baselines__ as fallback)
    const isPng = (f) => f.endsWith('.png');
    const isScreenshot = (f) => (f.includes('__results__') || f.includes('__baselines__')) && isPng(f);

    const [reactFiles, vueFiles] = await Promise.all([
        findFiles(reactDir, isScreenshot),
        findFiles(vueDir, isScreenshot),
    ]);

    console.log(`  React screenshots: ${reactFiles.length}`);
    console.log(`  Vue screenshots: ${vueFiles.length}`);

    // Build maps: normalized path -> absolute file path
    // __results__ entries take priority over __baselines__ entries
    const buildMap = (files) => {
        const map = new Map();
        for (const f of files) {
            const relPath = extractRelativePath(f, ['__results__', '__baselines__']);
            const normalizedPath = normalizeScreenshotPath(relPath);
            const isResult = f.includes('__results__');
            // Only overwrite if we don't have a __results__ entry yet
            if (!map.has(normalizedPath) || isResult) {
                map.set(normalizedPath, f);
            }
        }
        return map;
    };

    const reactMap = buildMap(reactFiles);
    const vueMap = buildMap(vueFiles);

    // Find matching pairs
    const matchedPaths = [...vueMap.keys()].filter((k) => reactMap.has(k));
    console.log(`  Matched pairs: ${matchedPaths.length}`);

    if (matchedPaths.length === 0) {
        console.log('No matching screenshots between React and Vue. Skipping.');
        return;
    }

    await fsPromises.mkdir(outputDir, { recursive: true });

    const results = [];
    let diffCount = 0;

    for (const normalizedPath of matchedPaths.sort()) {
        const reactFile = reactMap.get(normalizedPath);
        const vueFile = vueMap.get(normalizedPath);
        const diffFile = path.join(outputDir, '__diffs__', normalizedPath);

        const result = compareImages(reactFile, vueFile, diffFile);

        if (result.hasDiff) {
            diffCount++;

            // Copy originals for report display
            const reactDest = path.join(outputDir, '__react__', normalizedPath);
            const vueDest = path.join(outputDir, '__vue__', normalizedPath);

            fs.mkdirSync(path.dirname(reactDest), { recursive: true });
            fs.mkdirSync(path.dirname(vueDest), { recursive: true });
            fs.copyFileSync(reactFile, reactDest);
            fs.copyFileSync(vueFile, vueDest);
        }

        results.push({
            normalizedPath,
            ...result,
        });
    }

    // Write manifest
    const manifest = {
        totalPairs: matchedPaths.length,
        totalDiffs: diffCount,
        unmatchedReact: [...reactMap.keys()].filter((k) => !vueMap.has(k)).length,
        unmatchedVue: [...vueMap.keys()].filter((k) => !reactMap.has(k)).length,
        comparisons: results,
    };

    const manifestPath = path.join(outputDir, 'manifest.json');
    await fsPromises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    console.log(`\nCross-framework diff complete:`);
    console.log(`  Total pairs compared: ${matchedPaths.length}`);
    console.log(`  Pairs with differences: ${diffCount}`);
    console.log(`  React-only screenshots: ${manifest.unmatchedReact}`);
    console.log(`  Vue-only screenshots: ${manifest.unmatchedVue}`);
    console.log(`  Manifest written to: ${manifestPath}`);
}

/**
 * CI entry point (called from action.yml via actions/github-script).
 * Resolves react/vue directories from the CI artifacts directory structure.
 *
 * @param {Object} params
 * @param {string} params.artifactsDir - Path to the downloaded artifacts directory
 */
async function ciMain({ artifactsDir }) {
    return main({
        reactDir: path.join(artifactsDir, 'vis-report-react'),
        vueDir: path.join(artifactsDir, 'vis-report-vue'),
        outputDir: path.join(artifactsDir, 'cross-framework-diffs'),
    });
}

module.exports = ciMain;
module.exports.main = main;

// Allow running locally: node cross-framework-diff.js [output-dir]
// Compares screenshots from packages/lumx-react/__vis__/local and packages/lumx-vue/__vis__/local.
if (require.main === module) {
    const repoRoot = path.resolve(__dirname, '..', '..', '..');
    const outputDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repoRoot, 'cross-framework-diffs');

    main({
        reactDir: path.join(repoRoot, 'packages', 'lumx-react', '__vis__', 'local'),
        vueDir: path.join(repoRoot, 'packages', 'lumx-vue', '__vis__', 'local'),
        outputDir,
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
