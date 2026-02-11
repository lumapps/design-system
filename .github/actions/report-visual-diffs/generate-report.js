const fs = require('fs/promises');
const path = require('path');

const COMMENT_MARKER = '<!-- vis-report -->';

/**
 * List all files under a directory matching a predicate.
 * @param {string} dir
 * @param {(filePath: string) => boolean} predicate
 * @returns {Promise<string[]>}
 */
async function findFiles(dir, predicate) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
        return entries
            .filter((e) => !e.isDirectory())
            .map((e) => path.join(e.parentPath || e.path, e.name))
            .filter(predicate);
    } catch {
        return [];
    }
}

/**
 * Extract the relative image path after the image-type marker directory.
 * @param {string} filePath
 * @param {string} markerDir - e.g. '__diffs__'
 * @returns {string} relative path including .png extension (using '/' separators)
 */
function extractRelativeImagePath(filePath, markerDir) {
    const marker = markerDir + path.sep;
    const idx = filePath.indexOf(marker);
    if (idx === -1) return path.basename(filePath);
    return filePath
        .substring(idx + marker.length)
        .split(path.sep)
        .join('/');
}

/**
 * Convert a relative image path to a human-readable story name.
 * e.g. "components/button/Button.stories.tsx/base-auto.png" -> "components > button > Button.stories.tsx > base"
 * @param {string} relPath - Relative image path (with '/' separators)
 * @returns {string}
 */
function toStoryName(relPath) {
    return relPath
        .replace(/\.png$/, '')
        .replace(/-auto$/, '')
        .split('/')
        .join(' > ');
}

/**
 * Map a list of file paths into sorted screenshot entries.
 * @param {string[]} files
 * @param {string} markerDir
 * @returns {Array<{ storyName: string, relPath: string }>}
 */
function toEntries(files, markerDir) {
    return files
        .map((f) => {
            const relPath = extractRelativeImagePath(f, markerDir);
            return { storyName: toStoryName(relPath), relPath };
        })
        .sort((a, b) => a.storyName.localeCompare(b.storyName));
}

/**
 * Scan the downloaded artifacts directory for visual diffs, new screenshots, and deleted screenshots.
 *
 * Expected structure:
 *   vis-artifacts/
 *     vis-report-react/
 *       <platform>/__diffs__/.../*.png
 *       <platform>/__results__/.../*.png
 *       <platform>/__baselines__/.../*.png
 *
 * @param {string} artifactsDir
 * @returns {Promise<Array<{ label: string, hasBaselines: boolean, diffs: Array, newScreenshots: Array, deletedScreenshots: Array }>>}
 */
async function scanArtifacts(artifactsDir) {
    let entries;
    try {
        entries = await fs.readdir(artifactsDir, { withFileTypes: true });
    } catch {
        return [];
    }

    const packages = [];
    for (const entry of entries) {
        if (!entry.isDirectory() || !entry.name.startsWith('vis-report-')) continue;

        const label = entry.name.replace('vis-report-', '');
        const artifactRoot = path.join(artifactsDir, entry.name);

        const isPng = (f) => f.endsWith('.png');
        const [diffPngs, resultPngs, baselinePngs] = await Promise.all([
            findFiles(artifactRoot, (f) => f.includes('__diffs__') && isPng(f)),
            findFiles(artifactRoot, (f) => f.includes('__results__') && isPng(f)),
            findFiles(artifactRoot, (f) => f.includes('__baselines__') && isPng(f)),
        ]);

        // Read cached baselines manifest (lists baseline relPaths that existed before tests ran)
        let cachedBaselineRelPaths = null;
        try {
            const manifest = await fs.readFile(path.join(artifactRoot, 'cached-baselines.txt'), 'utf8');
            cachedBaselineRelPaths = new Set(
                manifest
                    .split('\n')
                    .map((l) => l.trim())
                    .filter(Boolean),
            );
        } catch {
            // Manifest not available
        }

        // Map to entries first, then use relPath sets for filtering
        const baselineEntries = toEntries(baselinePngs, '__baselines__');
        const resultRelPaths = new Set(toEntries(resultPngs, '__results__').map((e) => e.relPath));

        // New screenshots: in baselines after tests but NOT in cached baselines manifest
        const newScreenshots = cachedBaselineRelPaths
            ? baselineEntries.filter((e) => !cachedBaselineRelPaths.has(e.relPath))
            : [];
        const newRelPaths = new Set(newScreenshots.map((e) => e.relPath));

        packages.push({
            label,
            hasBaselines: cachedBaselineRelPaths ? cachedBaselineRelPaths.size > 0 : true,
            diffs: toEntries(diffPngs, '__diffs__'),
            newScreenshots,
            // Deleted screenshots: in baselines (from cache) but NOT in results (test no longer runs),
            // excluding new screenshots (which are also not in results)
            deletedScreenshots: baselineEntries.filter(
                (e) => !resultRelPaths.has(e.relPath) && !newRelPaths.has(e.relPath),
            ),
        });
    }

    return packages.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Build a collapsible details block with a summary title and a markdown image table.
 * @param {string} title - Summary title (supports HTML)
 * @param {Array<{ label: string, url: string }>} columns - Table columns with label and image URL
 * @returns {string}
 */
function buildImageBlock(title, columns) {
    const header = '| ' + columns.map((c) => c.label).join(' | ') + ' |';
    const separator = '| ' + columns.map(() => '---').join(' | ') + ' |';
    const row = '| ' + columns.map((c) => `<img src="${c.url}" width="300" />`).join(' | ') + ' |';

    const separator = header.replace(/[^|]/g, '-').replace(/\|-/g, '|--').replace(/-\|/g, '--|');

    return [
        `<details>`,
        `<summary><strong>${entry.storyName}</strong>${suffix}</summary>`,
        '',
        header,
        separator,
        row,
        '',
        '</details>',
    ].join('\n');
}

/**
 * Build a complete report markdown.
 *
 * @param {Array} packages - Packages with diffs, newScreenshots, deletedScreenshots
 * @param {Object} options
 * @param {string} options.imageUrlPrefix - Prefix for image URLs
 * @param {string} [options.reportUrl] - Link to full report
 * @param {string} [options.artifactUrl] - Link to download artifacts
 * @param {boolean} [options.summaryOnly] - Only include stats and links, no images
 * @returns {string}
 */
function buildReport(packages, options) {
    const { imageUrlPrefix, reportUrl, artifactUrl, cacheStatus = {}, maxItems } = options;

    const lines = [COMMENT_MARKER, '## Visual Regression Report', ''];

    // Calculate totals
    const totalChanges = packages.reduce(
        (sum, pkg) => sum + pkg.diffs.length + pkg.newScreenshots.length + pkg.deletedScreenshots.length,
        0,
    );

    if (totalChanges === 0) {
        const noBaselineLabels = packages.filter((pkg) => !pkg.hasBaselines).map((pkg) => pkg.label);
        if (noBaselineLabels.length > 0) {
            for (const label of noBaselineLabels) {
                lines.push(
                    `> **Warning:** @lumx/${label} — No baseline snapshots found. Diff results are not available.`,
                    '',
                );
            }
        } else {
            lines.push('All screenshots match the baselines.');
        }
        lines.push('', '---', '');
        if (artifactUrl) {
            lines.push(`[Download artifacts](${artifactUrl})`);
        }
        return lines.join('\n');
    }

    for (const pkg of packages) {
        const pkgTotal = pkg.diffs.length + pkg.newScreenshots.length + pkg.deletedScreenshots.length;

        if (pkgTotal === 0 && pkg.hasBaselines) {
            lines.push(`### @lumx/${pkg.label} — No changes`, '');
            continue;
        }

        if (!pkg.hasBaselines) {
            lines.push(`### @lumx/${pkg.label} — No baseline snapshots found`, '');
            lines.push('> **Warning:** Diff results may be unreliable since no baseline snapshots were available.', '');
            continue;
        }

        const parts = [];
        if (pkg.diffs.length > 0) parts.push(`${pkg.diffs.length} difference(s)`);
        if (pkg.newScreenshots.length > 0) parts.push(`${pkg.newScreenshots.length} new`);
        if (pkg.deletedScreenshots.length > 0) parts.push(`${pkg.deletedScreenshots.length} deleted`);
        lines.push(`### @lumx/${pkg.label} — ${parts.join(', ')}`, '');

        if (!summaryOnly) {
            const url = (entry, imageType) => `${imageUrlPrefix}/${pkg.label}/${imageType}/${entry.relPath}`;
            const sections = [
                {
                    entries: pkg.diffs,
                    heading: 'Differences',
                    columns: (e) => [
                        { label: 'Baseline', url: url(e, '__baselines__') },
                        { label: 'Current', url: url(e, '__results__') },
                        { label: 'Diff', url: url(e, '__diffs__') },
                    ],
                },
                {
                    entries: pkg.newScreenshots,
                    heading: 'New Screenshots',
                    suffix: ' (new)',
                    columns: (e) => [{ label: 'Current', url: url(e, '__baselines__') }],
                },
                {
                    entries: pkg.deletedScreenshots,
                    heading: 'Deleted Screenshots',
                    suffix: ' (deleted)',
                    columns: (e) => [{ label: 'Previous', url: url(e, '__baselines__') }],
                },
            ];

            for (const { entries, heading, suffix, columns } of sections) {
                if (entries.length === 0) continue;
                lines.push(`**${heading}:**`, '');
                for (const entry of entries) {
                    const title = `<strong>${entry.storyName}</strong>${suffix || ''}`;
                    lines.push(buildImageBlock(title, columns(entry)), '');
                }
            }
        }
    }

    // Footer
    if (reportUrl || artifactUrl) {
        const links = [];
        if (reportUrl) links.push(`[View full report](${reportUrl})`);
        if (artifactUrl) links.push(`[Download artifacts](${artifactUrl})`);
        lines.push('---', '', links.join(' · '));
    }

    return lines.join('\n');
}

/**
 * Main entry point for generating reports.
 *
 * @param {Object} params
 * @param {string} params.artifactsDir - Path to downloaded artifacts
 * @param {string} params.runId - GitHub Actions run ID
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {number} params.prNumber - Pull request number
 */
async function main({ artifactsDir, runId, owner, repo, prNumber }) {
    console.log(`Scanning artifacts in: ${artifactsDir}`);

    // 1. Scan artifacts
    const [packages, cacheStatus] = await Promise.all([scanArtifacts(artifactsDir), scanCacheStatus(artifactsDir)]);

    // Log totals
    for (const pkg of packages) {
        console.log(
            `  @lumx/${pkg.label}: ${pkg.diffs.length} diffs, ${pkg.newScreenshots.length} new, ${pkg.deletedScreenshots.length} deleted`,
        );
    }

    // 2. Build URLs
    const imageUrlPrefix = `https://raw.githubusercontent.com/wiki/${owner}/${repo}/pr-${prNumber}/visual-reports`;
    const reportFileName = `visual-reports-pr-${prNumber}-report`;
    const reportUrl = `https://github.com/${owner}/${repo}/wiki/${reportFileName}`;
    const artifactUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
    const baseOptions = { imageUrlPrefix, artifactUrl, crossFramework };

    // 3. Build full report (for wiki) with absolute image paths
    const fullReport = buildReport(packages, {
        imageUrlPrefix: imageBaseUrl,
        artifactUrl,
        cacheStatus,
    });

    // 4. Build PR comment (with absolute paths)
    let commentBody = buildReport(packages, {
        imageUrlPrefix: imageBaseUrl,
        reportUrl,
        artifactUrl,
        cacheStatus,
    });

    // Check if it fits in GitHub's comment limit
    if (commentBody.length > GITHUB_COMMENT_MAX_LENGTH) {
        console.log(`Full report too large (${commentBody.length} chars), truncating...`);
        commentBody = buildReport(packages, {
            ...baseOptions,
            reportUrl,
            artifactUrl,
            cacheStatus,
            maxItems: 30,
        });
    } else {
        console.log(`Full report fits in comment (${commentBody.length} chars)`);
    }

    // 5. Write outputs
    const reportPath = path.join(artifactsDir, `${reportFileName}.md`);
    const commentPath = path.join(artifactsDir, 'comment-body.md');

    await Promise.all([fs.writeFile(reportPath, fullReport, 'utf8'), fs.writeFile(commentPath, commentBody, 'utf8')]);

    console.log(`Report written to: ${reportPath}`);
    console.log(`Comment body written to: ${commentPath}`);

    // Also write to GITHUB_OUTPUT for convenience
    if (process.env.GITHUB_OUTPUT) {
        await fs.appendFile(process.env.GITHUB_OUTPUT, `report-path=${reportPath}\ncomment-path=${commentPath}\n`);
    }

    // Print comment body preview
    console.log('\n--- Comment body preview ---\n');
    console.log(commentBody.substring(0, 1000));
    if (commentBody.length > 1000) {
        console.log('... [truncated in preview]');
    }
}

module.exports = main;
module.exports.scanArtifacts = scanArtifacts;
module.exports.buildReport = buildReport;
