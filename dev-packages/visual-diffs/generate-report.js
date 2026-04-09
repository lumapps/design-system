const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const { md } = require('./md');
const { findFiles, extractRelativePath, normalizeScreenshotPath } = require('./utils');

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
 * @returns {Array<{ relPath: string, srcPath: string }>}
 */
function toEntries(files, markerDir) {
    return files
        .map((f) => ({ relPath: extractRelativePath(f, markerDir), srcPath: f }))
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
        const normalizedRelPath = normalizeScreenshotPath(entry.relPath);
        const storyFile = path.posix.dirname(normalizedRelPath);
        if (!groups.has(storyFile)) groups.set(storyFile, []);
        const shortName = stripScreenshotSuffix(path.posix.basename(normalizedRelPath));
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
 * Each entry includes `relPath` (relative screenshot path) and `srcPath` (absolute source file).
 * Diff entries are augmented with `baselineSrcPath` and `resultSrcPath` for the corresponding images.
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
    const resultEntries = toEntries(resultPngs, '__results__');
    const resultRelPaths = new Set(resultEntries.map((e) => e.relPath));

    // Build lookup maps: relPath -> srcPath
    const baselineSrcMap = new Map(baselineEntries.map((e) => [e.relPath, e.srcPath]));
    const resultSrcMap = new Map(resultEntries.map((e) => [e.relPath, e.srcPath]));

    const diffs = toEntries(diffPngs, '__diffs__').map((e) => ({
        ...e,
        baselineSrcPath: baselineSrcMap.get(e.relPath),
        resultSrcPath: resultSrcMap.get(e.relPath),
    }));
    const diffRelPaths = new Set(diffs.map((e) => e.relPath));

    // New screenshots: produced by this test run but NOT in cached baselines manifest.
    // Check both __baselines__ (vitest-plugin-vis writes here on first run) and __results__
    // (screenshots may only land in results when no baseline exists yet).
    const newFromBaselines = cachedBaselines ? baselineEntries.filter((e) => !cachedBaselines.has(e.relPath)) : [];
    const newFromResults = cachedBaselines
        ? resultEntries.filter((e) => !cachedBaselines.has(e.relPath) && !baselineSrcMap.has(e.relPath))
        : [];
    const newScreenshots = [...newFromBaselines, ...newFromResults];
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
            .filter((c) => c.hasDiff)
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
        return [...md.details(`${heading} (${entries.length})`, ...content), ''];
    }
    return [heading, '', ...content];
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
 * @param {{ headingLevel?: number }} [options]
 * @returns {string[]}
 */
function buildPackageHeading(pkg, { headingLevel = 2 } = {}) {
    if (!pkg.hasBaselines) {
        return [
            md.heading(headingLevel, `@lumx/${pkg.label} — No baseline snapshots found`),
            '',
            md.warning('Diff results may be unreliable since no baseline snapshots were available.'),
            '',
        ];
    }

    return [md.heading(headingLevel, `@lumx/${pkg.label} — ${summarizeChanges(pkg)}`), ''];
}

/**
 * Build cross-framework heading lines.
 * @param {Object} crossFramework
 * @param {{ headingLevel?: number }} [options]
 * @returns {string[]}
 */
function buildCrossFrameworkHeading(crossFramework, { headingLevel = 2 } = {}) {
    const { diffs, totalPairs, unmatchedReact, unmatchedVue } = crossFramework;
    const hasDiffs = diffs.length > 0;

    const summary = [
        hasDiffs ? `${diffs.length} difference(s)` : 'No differences',
        `${totalPairs} matched`,
        `${unmatchedReact} React-only`,
        `${unmatchedVue} Vue-only`,
    ].join(', ');

    return [md.heading(headingLevel, `@lumx/react vs @lumx/vue — ${summary}`)];
}

/**
 * Build the unchanged screenshots section with a zip download link and a collapsed list of names.
 * @param {Object} pkg
 * @param {string} imageUrlPrefix
 * @returns {string[]}
 */
function buildUnchangedSection(pkg, imageUrlPrefix) {
    if (pkg.unchangedScreenshots.length === 0) return [];
    const zipUrl = `${imageUrlPrefix}/${pkg.label}-unchanged.zip`;
    const content = [md.link('Download all unchanged screenshots (.zip)', zipUrl), ''];
    for (const [storyFile, groupEntries] of groupByStoryFile(pkg.unchangedScreenshots)) {
        const names = groupEntries.map((e) => e.shortName).join(', ');
        content.push(`- ${md.bold(storyFile.split('/').join(' > '))}: ${names}`);
    }
    return [
        ...md.details(`${md.heading(3, 'Unchanged Screenshots')} (${pkg.unchangedScreenshots.length})`, ...content),
        '',
    ];
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
 * Build a colocated image URL for a screenshot entry.
 * All images for a given screenshot live in the same directory:
 *   {prefix}/{label}/{normalizedRelPath without .png}/{variant}.png
 *
 * @param {string} imageUrlPrefix
 * @param {string} section - Section name (e.g. 'react', 'vue', 'cross-framework')
 * @param {{ relPath: string }} entry
 * @param {string} variant - Image variant (e.g. 'baseline', 'current', 'diff', 'react', 'vue')
 * @returns {string}
 */
function colocatedImageUrl(imageUrlPrefix, section, entry, variant) {
    const dir = normalizeScreenshotPath(entry.relPath).replace(/\.png$/, '');
    return `${imageUrlPrefix}/${section}/${dir}/${variant}.png`;
}

/**
 * Build a full report markdown with images and grouped sections (for wiki page).
 *
 * @param {Array} packages - Packages with diffs, newScreenshots, unchangedScreenshots, deletedScreenshots
 * @param {Object} options
 * @param {string} options.imageUrlPrefix - Prefix for image URLs
 * @param {string} [options.prUrl] - Link back to the pull request
 * @param {string} [options.prNumber] - Pull request number
 * @param {string} [options.artifactUrl] - Link to download artifacts
 * @param {Object} [options.crossFramework] - Cross-framework diff data
 * @returns {string}
 */
function buildFullReport(packages, options) {
    const { imageUrlPrefix, prUrl, prNumber, artifactUrl, crossFramework } = options;
    const lines = [];
    lines.push(md.link(`PR#${prNumber}`, prUrl), '');
    lines.push(...buildReportPreamble(packages));

    for (const pkg of packages) {
        lines.push(...buildPackageHeading(pkg));

        if (!pkg.hasBaselines) continue;

        const url = (entry, variant) => colocatedImageUrl(imageUrlPrefix, pkg.label, entry, variant);

        lines.push(
            ...buildGroupedSection(md.heading(3, 'Differences'), pkg.diffs, (e) =>
                renderImageEntry(e, [
                    { label: 'Baseline', url: url(e, 'baseline') },
                    { label: 'Current', url: url(e, 'current') },
                    { label: 'Diff', url: url(e, 'diff') },
                ]),
            ),
            ...buildGroupedSection(md.heading(3, 'New Screenshots'), pkg.newScreenshots, (e) =>
                renderImageEntry(e, [{ label: 'Current', url: url(e, 'current') }]),
            ),
            ...buildGroupedSection(md.heading(3, 'Deleted Screenshots'), pkg.deletedScreenshots, (e) =>
                renderImageEntry(e, [{ label: 'Previous', url: url(e, 'baseline') }]),
            ),
            ...buildUnchangedSection(pkg, imageUrlPrefix),
            md.rule,
        );
    }

    if (crossFramework) {
        lines.push(...buildCrossFrameworkHeading(crossFramework));

        if (crossFramework.diffs.length > 0) {
            lines.push(
                ...buildGroupedSection(md.heading(3, 'Differences'), crossFramework.diffs, (entry) => {
                    const url = (variant) => colocatedImageUrl(imageUrlPrefix, 'cross-framework', entry, variant);
                    return renderImageEntry(entry, [
                        { label: 'React', url: url('react') },
                        { label: 'Vue', url: url('vue') },
                        { label: 'Diff', url: url('diff') },
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
    const headingOptions = { headingLevel: 4 };
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
 * Copy a file to a destination, creating parent directories as needed.
 * @param {string} srcPath - Source file path
 * @param {string} destPath - Destination file path
 */
async function copyFile(srcPath, destPath) {
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(srcPath, destPath);
}

/**
 * Compute the colocated destination path for a screenshot entry.
 * Strips the .png extension from the relPath to create a directory, then appends {variant}.png.
 *
 * @param {string} outputDir - Root output directory
 * @param {string} section - Section name (e.g. 'react', 'vue', 'cross-framework')
 * @param {string} relPath - Relative screenshot path (e.g. 'components/button/Button.stories.tsx/base-auto.png')
 * @param {string} variant - Image variant name (e.g. 'baseline', 'current', 'diff')
 * @returns {string}
 */
function colocatedPath(outputDir, section, relPath, variant) {
    const dir = normalizeScreenshotPath(relPath).replace(/\.png$/, '');
    return path.join(outputDir, section, dir, `${variant}.png`);
}

/**
 * Consolidate all visual diff images into a single colocated output directory.
 *
 * Output structure:
 *   {outputDir}/
 *     {react,vue}/
 *       {story-path}/{screenshot-name}/
 *         baseline.png   — previous baseline (diffs, deleted, unchanged)
 *         current.png    — current result (diffs, new, unchanged)
 *         diff.png       — pixel diff (diffs only)
 *     cross-framework/
 *       {story-path}/{screenshot-name}/
 *         react.png
 *         vue.png
 *         diff.png
 *
 * @param {Array} packages - Scanned package data (with srcPath on entries)
 * @param {Object|null} crossFramework - Cross-framework diff data
 * @param {string} artifactsDir - Path to the raw artifacts directory
 * @param {string} outputDir - Path to write the consolidated output
 */
async function consolidateImages(packages, crossFramework, artifactsDir, outputDir) {
    console.log(`Consolidating images into: ${outputDir}`);
    await fs.mkdir(outputDir, { recursive: true });

    const copies = [];
    const unchangedZips = [];

    // Per-framework images
    for (const pkg of packages) {
        if (!pkg.hasBaselines) continue;
        const dest = (entry, variant) => colocatedPath(outputDir, pkg.label, entry.relPath, variant);

        // Diffs: baseline + current + diff
        for (const entry of pkg.diffs) {
            copies.push(copyFile(entry.srcPath, dest(entry, 'diff')));
            if (entry.baselineSrcPath) copies.push(copyFile(entry.baselineSrcPath, dest(entry, 'baseline')));
            if (entry.resultSrcPath) copies.push(copyFile(entry.resultSrcPath, dest(entry, 'current')));
        }

        // New screenshots: current only (from baselines or results, whichever is available)
        for (const entry of pkg.newScreenshots) {
            copies.push(copyFile(entry.srcPath, dest(entry, 'current')));
        }

        // Deleted screenshots: baseline only
        for (const entry of pkg.deletedScreenshots) {
            copies.push(copyFile(entry.srcPath, dest(entry, 'baseline')));
        }

        // Unchanged screenshots: bundled into a single zip per framework
        if (pkg.unchangedScreenshots.length > 0) {
            const zipPath = path.join(outputDir, `${pkg.label}-unchanged.zip`);
            unchangedZips.push({
                label: pkg.label,
                zipPath,
                entries: pkg.unchangedScreenshots,
            });
        }
    }

    // Cross-framework images (already colocated by cross-framework-diff.js)
    const crossFwSrcDir = path.join(artifactsDir, 'cross-framework-diffs');
    try {
        await fs.access(crossFwSrcDir);
        const crossFwFiles = await findFiles(crossFwSrcDir, (f) => f.endsWith('.png'));
        for (const srcFile of crossFwFiles) {
            // Preserve the relative path within cross-framework-diffs/
            const rel = path.relative(crossFwSrcDir, srcFile);
            copies.push(copyFile(srcFile, path.join(outputDir, 'cross-framework', rel)));
        }
    } catch {
        // No cross-framework diffs directory
    }

    await Promise.all(copies);
    console.log(`  Copied ${copies.length} files`);

    // Create zip archives for unchanged screenshots
    for (const { label, zipPath, entries } of unchangedZips) {
        // Create a temp directory with the colocated structure, then zip it
        const tempDir = path.join(outputDir, `.tmp-${label}-unchanged`);
        await fs.mkdir(tempDir, { recursive: true });
        await Promise.all(
            entries.map((entry) => {
                const destPath = colocatedPath(tempDir, label, entry.relPath, 'current');
                return copyFile(entry.srcPath, destPath);
            }),
        );
        // Resolve zipPath to absolute so it works regardless of cwd
        const absZipPath = path.resolve(zipPath);
        await execFileAsync('zip', ['-r', '-q', absZipPath, label], { cwd: tempDir });
        console.log(`  Zipped ${entries.length} unchanged ${label} screenshots into ${path.basename(zipPath)}`);
        await fs.rm(tempDir, { recursive: true, force: true });
    }
}

/**
 * Main entry point for generating reports.
 *
 * @param {Object} params
 * @param {string} params.artifactsDir - Path to downloaded artifacts
 * @param {string} params.outputDir - Path to write the consolidated visual report
 * @param {string} params.runId - GitHub Actions run ID
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {number} params.prNumber - Pull request number
 */
async function main({ artifactsDir, outputDir, runId, owner, repo, prNumber }) {
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

    // Log cross-framework results
    if (crossFramework) {
        console.log(
            `  Cross-framework: ${crossFramework.diffs.length} diffs out of ${crossFramework.totalPairs} pairs` +
                ` (${crossFramework.unmatchedReact} React-only, ${crossFramework.unmatchedVue} Vue-only)`,
        );
    } else {
        console.log('  Cross-framework: no manifest found (skipped)');
    }

    // 2. Consolidate all images into a single colocated output directory
    await consolidateImages(packages, crossFramework, artifactsDir, outputDir);

    // 3. Build URLs
    const imageUrlPrefix = `https://raw.githubusercontent.com/wiki/${owner}/${repo}/pr-${prNumber}/visual-diffs`;
    const reportFileName = `Visual-Reports-PR-${prNumber}`;
    const reportUrl = `https://github.com/${owner}/${repo}/wiki/${reportFileName}`;
    const prUrl = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
    const artifactUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
    const baseOptions = { imageUrlPrefix, prUrl, prNumber, artifactUrl, crossFramework };

    // 4. Build full report (for wiki) with images
    const fullReport = buildFullReport(packages, baseOptions);

    // 5. Build PR comment (summary only: stats + links, no images)
    const commentBody = buildSummaryReport(packages, { ...baseOptions, reportUrl });

    // 6. Write outputs
    // The wiki report goes into outputDir (uploaded to wiki + artifact).
    // The comment body goes into artifactsDir (only read by publish-comment.js, not uploaded).
    const reportPath = path.join(outputDir, `${reportFileName}.md`);
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
module.exports.scanCrossFrameworkDiffs = scanCrossFrameworkDiffs;
module.exports.buildFullReport = buildFullReport;
module.exports.buildSummaryReport = buildSummaryReport;
