const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

/**
 * Normalize a screenshot path by stripping the story file extension directory.
 * e.g. "components/button/Button.stories.tsx/base-auto.png"
 *   -> "components/button/Button/base-auto.png"
 *
 * @param {string} relPath - Relative path after __baselines__/
 * @returns {string} Normalized path
 */
function normalizeScreenshotPath(relPath) {
    return relPath.replace(/\.stories\.tsx?\//, '/');
}

/**
 * Find all PNG files under a directory matching a predicate.
 * @param {string} dir
 * @param {(filePath: string) => boolean} predicate
 * @returns {Promise<string[]>}
 */
async function findFiles(dir, predicate) {
    try {
        const entries = await fsPromises.readdir(dir, { withFileTypes: true, recursive: true });
        return entries
            .filter((e) => !e.isDirectory())
            .map((e) => path.join(e.parentPath || e.path, e.name))
            .filter(predicate);
    } catch {
        return [];
    }
}

/**
 * Extract the relative path after a marker directory (e.g. '__baselines__').
 * @param {string} filePath
 * @param {string} markerDir
 * @returns {string}
 */
function extractRelativePath(filePath, markerDir) {
    const marker = markerDir + path.sep;
    const idx = filePath.indexOf(marker);
    if (idx === -1) return path.basename(filePath);
    return filePath
        .substring(idx + marker.length)
        .split(path.sep)
        .join('/');
}

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
        const buf = Buffer.alloc(width * height * 4);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) * 4;
                if (y < image.height && x < image.width) {
                    const old = (image.width * y + x) * 4;
                    buf[idx] = image.data[old];
                    buf[idx + 1] = image.data[old + 1];
                    buf[idx + 2] = image.data[old + 2];
                    buf[idx + 3] = image.data[old + 3];
                } else {
                    // Semi-transparent black for out-of-bounds pixels
                    buf[idx] = 0;
                    buf[idx + 1] = 0;
                    buf[idx + 2] = 0;
                    buf[idx + 3] = 64;
                }
            }
        }
        return { data: buf, width, height };
    };

    return [resize(img1), resize(img2)];
}

/**
 * Compare two PNG files and produce a diff image.
 *
 * @param {string} reactPath - Path to react baseline PNG
 * @param {string} vuePath - Path to vue baseline PNG
 * @param {string} diffPath - Path to write the diff PNG
 * @returns {{ diffPixels: number, diffPercent: number, totalPixels: number }}
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

    if (diffPixels > 0) {
        fs.mkdirSync(path.dirname(diffPath), { recursive: true });
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }

    return { diffPixels, diffPercent, totalPixels };
}

/**
 * Main entry point for cross-framework visual diff.
 *
 * @param {Object} params
 * @param {string} params.artifactsDir - Path to the downloaded artifacts directory
 */
async function main({ artifactsDir }) {
    console.log('Cross-framework visual diff: scanning artifacts...');

    const reactDir = path.join(artifactsDir, 'vis-report-react');
    const vueDir = path.join(artifactsDir, 'vis-report-vue');

    // Check both artifacts exist
    for (const dir of [reactDir, vueDir]) {
        try {
            await fsPromises.access(dir);
        } catch {
            console.log(`Artifact directory not found: ${dir}. Skipping cross-framework diff.`);
            return;
        }
    }

    // Find all baseline PNGs in each artifact
    const isPng = (f) => f.endsWith('.png');
    const isBaseline = (f) => f.includes('__baselines__') && isPng(f);

    const [reactFiles, vueFiles] = await Promise.all([findFiles(reactDir, isBaseline), findFiles(vueDir, isBaseline)]);

    console.log(`  React baselines: ${reactFiles.length}`);
    console.log(`  Vue baselines: ${vueFiles.length}`);

    // Build maps: normalized path -> absolute file path
    const reactMap = new Map();
    for (const f of reactFiles) {
        const relPath = extractRelativePath(f, '__baselines__');
        const normalizedPath = normalizeScreenshotPath(relPath);
        reactMap.set(normalizedPath, f);
    }

    const vueMap = new Map();
    for (const f of vueFiles) {
        const relPath = extractRelativePath(f, '__baselines__');
        const normalizedPath = normalizeScreenshotPath(relPath);
        vueMap.set(normalizedPath, f);
    }

    // Find matching pairs
    const matchedPaths = [...vueMap.keys()].filter((k) => reactMap.has(k));
    console.log(`  Matched pairs: ${matchedPaths.length}`);

    if (matchedPaths.length === 0) {
        console.log('No matching screenshots between React and Vue. Skipping.');
        return;
    }

    const outputDir = path.join(artifactsDir, 'cross-framework-diffs');
    await fsPromises.mkdir(outputDir, { recursive: true });

    const results = [];
    let diffCount = 0;

    for (const normalizedPath of matchedPaths.sort()) {
        const reactFile = reactMap.get(normalizedPath);
        const vueFile = vueMap.get(normalizedPath);
        const diffFile = path.join(outputDir, '__diffs__', normalizedPath);

        const result = compareImages(reactFile, vueFile, diffFile);

        if (result.diffPixels > 0) {
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

module.exports = main;
