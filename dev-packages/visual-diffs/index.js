#!/usr/bin/env node

const path = require('path');
const fs = require('fs/promises');
const crossFrameworkDiff = require('./cross-framework-diff');
const generateReport = require('./generate-report');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Run cross-framework diff and generate visual report.
 *
 * Supports two modes:
 *   - **Local mode** (default): reads snapshots from `__vis__/local` directories,
 *     creates a temp artifacts layout, and generates the report.
 *   - **CI mode** (`artifactsDir` provided): reads from pre-existing CI artifact
 *     directories (vis-report-react, vis-report-vue) directly.
 *
 * @param {Object} params
 * @param {string} [params.outputDir] - Output directory (default: <repo-root>/visual-diffs)
 * @param {string} [params.artifactsDir] - CI artifacts directory (skips local symlink setup)
 * @param {string} [params.runId] - GitHub Actions run ID
 * @param {string} [params.owner] - Repository owner
 * @param {string} [params.repo] - Repository name
 * @param {number} [params.prNumber] - Pull request number
 */
async function main({
    outputDir = path.join(REPO_ROOT, 'visual-diffs'),
    artifactsDir,
    runId = 'local',
    owner = 'local',
    repo = 'local',
    prNumber = 0,
} = {}) {
    let effectiveArtifactsDir = artifactsDir;
    let cleanupDir = null;

    if (!artifactsDir) {
        // Local mode: create temp artifacts dir with symlinks to __vis__/local
        const reactVisDir = path.join(REPO_ROOT, 'packages', 'lumx-react', '__vis__', 'local');
        const vueVisDir = path.join(REPO_ROOT, 'packages', 'lumx-vue', '__vis__', 'local');

        effectiveArtifactsDir = path.join(outputDir, '.artifacts');
        cleanupDir = effectiveArtifactsDir;
        await fs.mkdir(effectiveArtifactsDir, { recursive: true });

        for (const [src, destName] of [
            [reactVisDir, 'vis-report-react'],
            [vueVisDir, 'vis-report-vue'],
        ]) {
            try {
                await fs.access(src);
                const destDir = path.join(effectiveArtifactsDir, destName);
                await fs.mkdir(destDir, { recursive: true });
                const link = path.join(destDir, 'linux');
                await fs.rm(link, { force: true });
                await fs.symlink(path.resolve(src), link);
            } catch {
                console.log(`Skipping ${src} (not found)`);
            }
        }
    }

    // Determine react/vue directories for cross-framework diff
    const reactDir = path.join(effectiveArtifactsDir, 'vis-report-react');
    const vueDir = path.join(effectiveArtifactsDir, 'vis-report-vue');

    // 1. Run cross-framework diff
    await crossFrameworkDiff({
        reactDir,
        vueDir,
        outputDir: path.join(effectiveArtifactsDir, 'cross-framework-diffs'),
    });

    // 2. Generate report (scan, consolidate, build markdown)
    await generateReport({
        artifactsDir: effectiveArtifactsDir,
        outputDir,
        runId,
        owner,
        repo,
        prNumber,
    });

    // 3. Clean up temp artifacts dir (local mode only)
    if (cleanupDir) {
        await fs.rm(cleanupDir, { recursive: true, force: true });
    }

    console.log(`\nVisual report generated in: ${outputDir}`);
}

// CLI entry point
if (require.main === module) {
    const args = process.argv.slice(2);
    const params = {};

    // Parse --key=value args, fallback to positional output-dir
    for (const arg of args) {
        const match = arg.match(/^--(\w[\w-]*)=(.*)$/);
        if (match) {
            const key = match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            params[key] = key === 'prNumber' ? Number(match[2]) : match[2];
        } else if (!params.outputDir) {
            params.outputDir = path.resolve(arg);
        }
    }

    main(params).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = main;
