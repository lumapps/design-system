const fs = require('fs/promises');
const path = require('path');

const { md } = require('./md');

/**
 * List all files under a directory matching a predicate.
 * @param {string} dir
 * @param {(filePath: string) => boolean} predicate
 * @returns {Promise<string[]>}
 */
async function findFiles(dir, predicate) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
        return entries.flatMap((e) => {
            if (e.isDirectory()) return [];
            const filePath = path.join(e.parentPath || e.path, e.name);
            return predicate(filePath) ? [filePath] : [];
        });
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
 * Strip the `.png` extension and `-auto` suffix from screenshot file names.
 * e.g. "base-auto.png" -> "base"
 * @param {string} name
 * @returns {string}
 */
function stripScreenshotSuffix(name) {
    return name.replace(/\.png$/, '').replace(/-auto$/, '');
}

/**
 * Map a list of file paths into sorted screenshot entries.
 * @param {string[]} files
 * @param {string} markerDir
 * @returns {Array<{ relPath: string }>}
 */
function toEntries(files, markerDir) {
    return files
        .map((f) => ({ relPath: extractRelativeImagePath(f, markerDir) }))
        .sort((a, b) => a.relPath.localeCompare(b.relPath));
}

/**
 * Group entries by their story file path (dirname of relPath).
 * Each entry is augmented with a shortName (basename without suffix).
 * @param {Array<{ relPath: string }>} entries
 * @returns {Array<[string, Array<{ relPath: string, shortName: string }>]>}
 */
function groupByStoryFile(entries) {
    const groups = new Map();
    for (const entry of entries) {
        const storyFile = path.posix.dirname(entry.relPath);
        if (!groups.has(storyFile)) groups.set(storyFile, []);
        const shortName = stripScreenshotSuffix(path.posix.basename(entry.relPath));
        groups.get(storyFile).push({ ...entry, shortName });
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * Read the cached baselines manifest for a package artifact.
 * @param {string} artifactRoot
 * @returns {Promise<Set<string> | null>} Set of baseline relPaths, or null if unavailable
 */
async function readBaselineManifest(artifactRoot) {
    try {
        const content = await fs.readFile(path.join(artifactRoot, 'cached-baselines.txt'), 'utf8');
        return new Set(
            content
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean),
        );
    } catch {
        return null;
    }
}

/**
 * Scan a single package artifact directory and categorize its screenshots.
 *
 * @param {string} artifactRoot - Path to the package artifact directory
 * @returns {Promise<{ diffs: Array, newScreenshots: Array, unchangedScreenshots: Array, deletedScreenshots: Array, hasBaselines: boolean }>}
 */
async function scanPackage(artifactRoot) {
    const isPng = (f) => f.endsWith('.png');
    const [diffPngs, resultPngs, baselinePngs] = await Promise.all([
        findFiles(artifactRoot, (f) => f.includes('__diffs__') && isPng(f)),
        findFiles(artifactRoot, (f) => f.includes('__results__') && isPng(f)),
        findFiles(artifactRoot, (f) => f.includes('__baselines__') && isPng(f)),
    ]);

    const cachedBaselines = await readBaselineManifest(artifactRoot);

    const baselineEntries = toEntries(baselinePngs, '__baselines__');
    const resultRelPaths = new Set(resultPngs.map((f) => extractRelativeImagePath(f, '__results__')));

    const diffs = toEntries(diffPngs, '__diffs__');
    const diffRelPaths = new Set(diffs.map((e) => e.relPath));

    // New screenshots: in baselines after tests but NOT in cached baselines manifest
    const newScreenshots = cachedBaselines ? baselineEntries.filter((e) => !cachedBaselines.has(e.relPath)) : [];
    const newRelPaths = new Set(newScreenshots.map((e) => e.relPath));

    // Unchanged screenshots: in cached baselines AND in results AND NOT in diffs
    const unchangedScreenshots = cachedBaselines
        ? baselineEntries.filter(
              (e) => cachedBaselines.has(e.relPath) && resultRelPaths.has(e.relPath) && !diffRelPaths.has(e.relPath),
          )
        : [];

    // Deleted screenshots: in cached baselines but NOT in results, excluding new screenshots
    const deletedScreenshots = baselineEntries.filter(
        (e) => !resultRelPaths.has(e.relPath) && !newRelPaths.has(e.relPath),
    );

    return {
        hasBaselines: cachedBaselines ? cachedBaselines.size > 0 : true,
        diffs,
        newScreenshots,
        unchangedScreenshots,
        deletedScreenshots,
    };
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
 * @returns {Promise<Array<{ label: string, hasBaselines: boolean, diffs: Array, newScreenshots: Array, unchangedScreenshots: Array, deletedScreenshots: Array }>>}
 */
async function scanArtifacts(artifactsDir) {
    let entries;
    try {
        entries = await fs.readdir(artifactsDir, { withFileTypes: true });
    } catch {
        return [];
    }

    const packageDirs = entries.filter((e) => e.isDirectory() && e.name.startsWith('vis-report-'));

    const packages = await Promise.all(
        packageDirs.map(async (entry) => {
            const label = entry.name.replace('vis-report-', '');
            const result = await scanPackage(path.join(artifactsDir, entry.name));
            return { label, ...result };
        }),
    );

    return packages.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Scan the cross-framework diff manifest produced by cross-framework-diff.js.
 *
 * @param {string} artifactsDir
 * @returns {Promise<{ diffs: Array<{ relPath: string, diffPercent: number }>, totalPairs: number, unmatchedReact: number, unmatchedVue: number } | null>}
 */
async function scanCrossFrameworkDiffs(artifactsDir) {
    const manifestPath = path.join(artifactsDir, 'cross-framework-diffs', 'manifest.json');
    try {
        const content = await fs.readFile(manifestPath, 'utf8');
        const manifest = JSON.parse(content);

        const diffs = manifest.comparisons
            .filter((c) => c.diffPixels > 0)
            .map((c) => ({
                relPath: c.normalizedPath,
                diffPercent: c.diffPercent,
            }))
            .sort((a, b) => a.relPath.localeCompare(b.relPath));

        return {
            diffs,
            totalPairs: manifest.totalPairs,
            unmatchedReact: manifest.unmatchedReact,
            unmatchedVue: manifest.unmatchedVue,
        };
    } catch {
        return null;
    }
}

/**
 * Build a section with entries grouped by story file, each group in a collapsible details block.
 * @param {string} heading - Section heading (e.g. "Differences")
 * @param {Array<{ relPath: string }>} entries
 * @param {(entry: any) => string[]} renderEntry - Renders lines for a single entry within a group
 * @param {{ collapsed?: boolean }} [options] - If collapsed, the entire section is wrapped in a details block
 * @returns {string[]} lines to append to the report
 */
function buildGroupedSection(heading, entries, renderEntry, { collapsed = false } = {}) {
    if (entries.length === 0) return [];
    const content = [];
    for (const [storyFile, groupEntries] of groupByStoryFile(entries)) {
        const summary = `${md.bold(storyFile.split('/').join(' > '))} (${groupEntries.length})`;
        content.push(...md.details(summary, ...groupEntries.flatMap(renderEntry)), '');
    }
    if (collapsed) {
        return [...md.details(`${md.bold(`${heading}:`)} (${entries.length})`, ...content), ''];
    }
    return [md.bold(`${heading}:`), '', ...content];
}

/**
 * Render a single entry as an image table.
 * @param {Object} entry
 * @param {Array<{ label: string, url: string }>} columns - Table columns with label and image URL
 * @returns {string[]}
 */
function renderImageEntry(entry, columns) {
    const suffix = entry.diffPercent !== undefined ? ` (${entry.diffPercent.toFixed(2)}% diff)` : '';
    const table = md.table(
        columns.map((c) => c.label),
        columns.map((c) => md.linkedImage(c.url, { width: 300 })),
    );
    return [md.bold(`${entry.shortName}${suffix}`), '', table, ''];
}

/**
 * Summarize changes for a package as a human-readable string.
 * @param {Object} pkg
 * @returns {string} e.g. "3 difference(s), 1 new" or "No changes"
 */
function summarizeChanges(pkg) {
    const parts = [
        pkg.diffs.length > 0 && `${pkg.diffs.length} difference(s)`,
        pkg.newScreenshots.length > 0 && `${pkg.newScreenshots.length} new`,
        pkg.deletedScreenshots.length > 0 && `${pkg.deletedScreenshots.length} deleted`,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No changes';
}

/**
 * Build report preamble: "no changes" or "no baselines" message when there are no visual changes.
 * Returns an empty array if there are changes (the per-package headings will describe them).
 *
 * @param {Array} packages - Packages with diffs, newScreenshots, deletedScreenshots
 * @returns {string[]}
 */
function buildReportPreamble(packages) {
    if (packages.some((pkg) => summarizeChanges(pkg) !== 'No changes')) return [];

    const noBaselineLabels = packages.filter((pkg) => !pkg.hasBaselines).map((pkg) => pkg.label);
    if (noBaselineLabels.length > 0) {
        return noBaselineLabels.flatMap((label) => [
            md.warning(`@lumx/${label} — No baseline snapshots found. Diff results are not available.`),
            '',
        ]);
    }
    return ['All screenshots match the baselines.'];
}

/**
 * Build per-package heading lines (status summary).
 * @param {Object} pkg
 * @param {{ heading?: (text: string) => string }} [options]
 * @returns {string[]}
 */
function buildPackageHeading(pkg, { heading = md.h2 } = {}) {
    if (!pkg.hasBaselines) {
        return [
            heading(`@lumx/${pkg.label} — No baseline snapshots found`),
            '',
            md.warning('Diff results may be unreliable since no baseline snapshots were available.'),
            '',
        ];
    }

    return [heading(`@lumx/${pkg.label} — ${summarizeChanges(pkg)}`), ''];
}

/**
 * Build cross-framework heading lines.
 * @param {Object} crossFramework
 * @param {{ heading?: (text: string) => string }} [options]
 * @returns {string[]}
 */
function buildCrossFrameworkHeading(crossFramework, { heading = md.h2 } = {}) {
    const { diffs, totalPairs, unmatchedReact, unmatchedVue } = crossFramework;
    const hasDiffs = diffs.length > 0;

    const summary = hasDiffs
        ? [
              `${diffs.length} difference(s)`,
              unmatchedReact > 0 && `${unmatchedReact} React-only`,
              unmatchedVue > 0 && `${unmatchedVue} Vue-only`,
          ]
              .filter(Boolean)
              .join(', ')
        : 'No differences';

    const note = hasDiffs
        ? `Compared ${totalPairs} matching baseline(s). This section is informational only.`
        : `Compared ${totalPairs} matching screenshot(s). All identical.`;

    return [md.rule, '', heading(`Cross-framework (React vs Vue) — ${summary}`), '', md.blockquote(note), ''];
}

/**
 * Build footer links.
 * @param {Object} options
 * @param {string} [options.reportUrl]
 * @param {string} [options.artifactUrl]
 * @returns {string[]}
 */
function buildFooter({ reportUrl, artifactUrl }) {
    if (!reportUrl && !artifactUrl) return [];
    const links = [];
    if (reportUrl) links.push(md.link('View full report', reportUrl));
    if (artifactUrl) links.push(md.link('Download artifacts', artifactUrl));
    return [md.rule, '', links.join(' · ')];
}

/**
 * Build a full report markdown with images and grouped sections (for wiki page).
 *
 * @param {Array} packages - Packages with diffs, newScreenshots, unchangedScreenshots, deletedScreenshots
 * @param {Object} options
 * @param {string} options.imageUrlPrefix - Prefix for image URLs
 * @param {string} [options.artifactUrl] - Link to download artifacts
 * @param {Object} [options.crossFramework] - Cross-framework diff data
 * @returns {string}
 */
function buildFullReport(packages, options) {
    const { imageUrlPrefix, artifactUrl, crossFramework } = options;
    const lines = buildReportPreamble(packages);

    for (const pkg of packages) {
        lines.push(...buildPackageHeading(pkg));

        if (!pkg.hasBaselines) continue;

        const url = (entry, imageType) => `${imageUrlPrefix}/${pkg.label}/${imageType}/${entry.relPath}`;

        lines.push(
            ...buildGroupedSection('Differences', pkg.diffs, (e) =>
                renderImageEntry(e, [
                    { label: 'Baseline', url: url(e, '__baselines__') },
                    { label: 'Current', url: url(e, '__results__') },
                    { label: 'Diff', url: url(e, '__diffs__') },
                ]),
            ),
            ...buildGroupedSection('New Screenshots', pkg.newScreenshots, (e) =>
                renderImageEntry(e, [{ label: 'Current', url: url(e, '__baselines__') }]),
            ),
            ...buildGroupedSection('Deleted Screenshots', pkg.deletedScreenshots, (e) =>
                renderImageEntry(e, [{ label: 'Previous', url: url(e, '__baselines__') }]),
            ),
            ...buildGroupedSection(
                'Unchanged Screenshots',
                pkg.unchangedScreenshots,
                (e) => renderImageEntry(e, [{ label: 'Current', url: url(e, '__baselines__') }]),
                { collapsed: true },
            ),
        );
    }

    if (crossFramework) {
        lines.push(...buildCrossFrameworkHeading(crossFramework));

        if (crossFramework.diffs.length > 0) {
            lines.push(
                ...buildGroupedSection('Differences', crossFramework.diffs, (entry) => {
                    const cfUrl = (type) => `${imageUrlPrefix}/cross-framework/${type}/${entry.relPath}`;
                    return renderImageEntry(entry, [
                        { label: 'React', url: cfUrl('__react__') },
                        { label: 'Vue', url: cfUrl('__vue__') },
                        { label: 'Diff', url: cfUrl('__diffs__') },
                    ]);
                }),
            );
        }
    }

    lines.push(...buildFooter({ artifactUrl }));

    return lines.join('\n');
}

/**
 * Build a summary report markdown with stats and links only, no images (for PR comment).
 *
 * @param {Array} packages - Packages with diffs, newScreenshots, unchangedScreenshots, deletedScreenshots
 * @param {Object} options
 * @param {string} [options.reportUrl] - Link to full report
 * @param {string} [options.artifactUrl] - Link to download artifacts
 * @param {Object} [options.crossFramework] - Cross-framework diff data
 * @returns {string}
 */
function buildSummaryReport(packages, options) {
    const { reportUrl, artifactUrl, crossFramework } = options;
    const headingOptions = { heading: md.h3 };
    const lines = buildReportPreamble(packages);

    for (const pkg of packages) {
        lines.push(...buildPackageHeading(pkg, headingOptions));
    }

    if (crossFramework) {
        lines.push(...buildCrossFrameworkHeading(crossFramework, headingOptions));
    }

    lines.push(...buildFooter({ reportUrl, artifactUrl }));

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
    const [packages, crossFramework] = await Promise.all([
        scanArtifacts(artifactsDir),
        scanCrossFrameworkDiffs(artifactsDir),
    ]);

    // Log totals
    for (const pkg of packages) {
        console.log(
            `  @lumx/${pkg.label}: ${pkg.diffs.length} diffs, ${pkg.newScreenshots.length} new, ${pkg.deletedScreenshots.length} deleted, ${pkg.unchangedScreenshots.length} unchanged`,
        );
    }

    // 2. Build URLs
    const imageUrlPrefix = `https://raw.githubusercontent.com/wiki/${owner}/${repo}/pr-${prNumber}/visual-reports`;
    const reportFileName = `Visual-Reports-PR-${prNumber}`;
    const reportUrl = `https://github.com/${owner}/${repo}/wiki/${reportFileName}`;
    const artifactUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
    const baseOptions = { imageUrlPrefix, artifactUrl, crossFramework };

    // Log cross-framework results
    if (crossFramework) {
        console.log(
            `  Cross-framework: ${crossFramework.diffs.length} diffs out of ${crossFramework.totalPairs} pairs` +
                ` (${crossFramework.unmatchedReact} React-only, ${crossFramework.unmatchedVue} Vue-only)`,
        );
    } else {
        console.log('  Cross-framework: no manifest found (skipped)');
    }

    // 3. Build full report (for wiki) with images
    const fullReport = buildFullReport(packages, baseOptions);

    // 4. Build PR comment (summary only: stats + links, no images)
    const commentBody = buildSummaryReport(packages, { ...baseOptions, reportUrl });

    // 5. Write outputs
    const reportPath = path.join(artifactsDir, `${reportFileName}.md`);
    const commentPath = 'comment-body.md';

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
module.exports.scanCrossFrameworkDiffs = scanCrossFrameworkDiffs;
module.exports.buildFullReport = buildFullReport;
module.exports.buildSummaryReport = buildSummaryReport;
