const fsPromises = require('fs/promises');
const path = require('path');

/**
 * Find all files under a directory matching a predicate.
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
 * Extract the relative path after a marker directory (e.g. '__results__', '__baselines__', '__diffs__').
 *
 * Accepts a single marker string or an array of markers (tried in order, first match wins).
 *
 * @param {string} filePath
 * @param {string | string[]} markerDirs - Marker directory name(s) to look for
 * @returns {string} Relative path after the marker, using '/' separators
 */
function extractRelativePath(filePath, markerDirs) {
    const markers = Array.isArray(markerDirs) ? markerDirs : [markerDirs];
    for (const markerDir of markers) {
        const marker = markerDir + path.sep;
        const idx = filePath.indexOf(marker);
        if (idx !== -1) {
            return filePath
                .substring(idx + marker.length)
                .split(path.sep)
                .join('/');
        }
    }
    return path.basename(filePath);
}

/**
 * Normalize a screenshot path by stripping the story file extension directory.
 * e.g. "components/button/Button.stories.tsx/base-auto.png"
 *   -> "components/button/Button/base-auto.png"
 *
 * @param {string} relPath - Relative screenshot path
 * @returns {string} Normalized path
 */
function normalizeScreenshotPath(relPath) {
    return relPath.replace(/\.stories\.tsx?\//, '/');
}

module.exports = { findFiles, extractRelativePath, normalizeScreenshotPath };
