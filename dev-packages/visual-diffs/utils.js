const fsPromises = require('fs/promises');
const path = require('path');

/**
 * Find all files under a directory matching a predicate.
 * Follows symlinks to directories (Node's recursive readdir does not).
 * @param {string} dir
 * @param {(filePath: string) => boolean} predicate
 * @returns {Promise<string[]>}
 */
async function findFiles(dir, predicate) {
    try {
        const results = [];
        const queue = [dir];
        while (queue.length > 0) {
            const current = queue.shift();
            const entries = await fsPromises.readdir(current, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(current, entry.name);
                if (entry.isDirectory() || entry.isSymbolicLink()) {
                    // Follow symlinks by checking if target is a directory
                    try {
                        const stat = await fsPromises.stat(fullPath);
                        if (stat.isDirectory()) {
                            queue.push(fullPath);
                            continue;
                        }
                    } catch {
                        continue;
                    }
                }
                if (!entry.isDirectory() && predicate(fullPath)) {
                    results.push(fullPath);
                }
            }
        }
        return results;
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
    return relPath.replace(/\.stories\.[jt]sx?\//, '/');
}

module.exports = { findFiles, extractRelativePath, normalizeScreenshotPath };
