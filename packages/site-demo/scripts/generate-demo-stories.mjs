// Generate Storybook story files from site-demo component and utility demos.
//
// Globs content/product/*/*/{react,vue}/*.{tsx,vue} to find all demos
// and generates corresponding .stories.tsx files in lumx-react and lumx-vue.
//
// Usage: node scripts/generate-demo-stories.js [--react] [--vue]
//   --react  Generate only React stories
//   --vue    Generate only Vue stories
//   (default: generate both)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import glob from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DEMO_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(SITE_DEMO_DIR, 'content/product');
const REACT_OUTPUT_DIR = path.resolve(SITE_DEMO_DIR, '../lumx-react/src/stories/demos-generated');
const VUE_OUTPUT_DIR = path.resolve(SITE_DEMO_DIR, '../lumx-vue/src/stories/demos-generated');

/** Map content/product/ category dirs to story title prefixes.
 *  Only categories listed here are scanned for demos. */
const STORY_TITLES = {
    components: 'LumX components',
    utilities: 'utils',
};

/** Brace pattern matching the category keys */
const CATEGORIES_GLOB = `{${Object.keys(STORY_TITLES).join(',')}}`;

/**
 * Convert a kebab-case demo file name to a PascalCase story name.
 * E.g. "high-emphasis" -> "HighEmphasis"
 * @param {string} name
 * @returns {string}
 */
function toPascalCase(name) {
    return name.replace(/(^|-)([a-z])/g, (_, _sep, char) => char.toUpperCase());
}

/**
 * Scan for all demo files for a given framework using a single glob,
 * then group them by category + folder.
 *
 * @param {'react' | 'vue'} fw
 * @param {string} ext - file extension including dot (e.g. '.tsx' or '.vue')
 * @returns {Map<string, { folder: string, sourceDir: string, storyTitle: string, demos: { name: string, storyName: string }[] }>}
 */
function scanDemos(fw, ext) {
    const pattern = `${CATEGORIES_GLOB}/*/${fw}/*${ext}`;
    const files = glob.sync(pattern, { cwd: CONTENT_DIR });

    // Group files by category/folder
    /** @type {Map<string, { folder: string, sourceDir: string, storyTitle: string, demos: { name: string, storyName: string }[] }>} */
    const groups = new Map();

    for (const file of files) {
        // file looks like: "components/thumbnail/react/sizes.tsx"
        const match = file.match(/^([^/]+)\/([^/]+)\/[^/]+\/([^/]+)\.[^.]+$/);
        if (!match) continue;
        const [, category, folder, demoName] = match;
        const key = `${category}/${folder}`;

        if (!groups.has(key)) {
            groups.set(key, {
                folder,
                sourceDir: path.join(CONTENT_DIR, category),
                storyTitle: STORY_TITLES[category] || category,
                demos: [],
            });
        }
        groups.get(key).demos.push({ name: demoName, storyName: toPascalCase(demoName) });
    }

    // Sort demos alphabetically by name within each group
    for (const group of groups.values()) {
        group.demos.sort((a, b) => a.name.localeCompare(b.name));
    }

    return groups;
}

/** Generate stories file content */
function generateStories(folder, demos, { prefix, fw, importExt, storyTitle }) {
    const imports = [
        `import { FlexBox } from '@lumx/${fw}/components/flex-box';`,
        "import { withWrapper } from '../decorators/withWrapper';",
        ...demos.map((d) => `import ${d.storyName}Component from '${prefix}/${folder}/${fw}/${d.name}${importExt}';`),
    ];

    const stories = demos
        .map((d) => `export const ${d.storyName} = { render: () => <${d.storyName}Component /> };`)
        .join('\n');

    return [
        `// AUTO-GENERATED from site-demo — do not edit manually.`,
        ``,
        imports.join('\n'),
        ``,
        `export default {\n    title: '${storyTitle}/${folder}/Demos',\n    decorators: [withWrapper({ vAlign: 'space-evenly', hAlign: 'center', wrap: true }, FlexBox)],\n};`,
        ``,
        stories,
        ``,
    ].join('\n');
}

/**
 * Run an async function only once per process. Subsequent calls return the same promise.
 * @template {any[]} A
 * @param {(...args: A) => Promise<void>} fn
 * @returns {(...args: A) => Promise<void>}
 */
function once(fn) {
    let promise;
    return (...args) => (promise ??= fn(...args));
}

/**
 * Generate demo story files for a given framework.
 * @param {'react' | 'vue'} fw
 * @param {string} outputDir
 * @param {string} ext - file extension including dot (e.g. '.tsx' or '.vue')
 * @param {(msg: string) => void} log
 */
function generateDemoStories(fw, outputDir, ext, log) {
    fs.mkdirSync(outputDir, { recursive: true });
    const groups = scanDemos(fw, ext);
    const importExt = ext === '.tsx' ? '' : ext;

    let count = 0;
    for (const { folder, sourceDir, storyTitle, demos } of groups.values()) {
        const prefix = path.relative(outputDir, sourceDir);
        fs.writeFileSync(
            path.join(outputDir, `${folder}.stories.tsx`),
            generateStories(folder, demos, { prefix, fw, importExt, storyTitle }),
        );
        count++;
    }
    log(`Generated ${count} ${fw} demo story files in ${outputDir}`);
}

/**
 * Generate React demo story files.
 * @param {(msg: string) => void} [log] - Optional log function (e.g. Rollup's `this.info`). Falls back to `console.log`.
 */
export const generateReactDemoStories = once(async function generateReactDemoStories(log = console.log) {
    generateDemoStories('react', REACT_OUTPUT_DIR, '.tsx', log);
});

/**
 * Generate Vue demo story files.
 * @param {(msg: string) => void} [log] - Optional log function (e.g. Rollup's `this.info`). Falls back to `console.log`.
 */
export const generateVueDemoStories = once(async function generateVueDemoStories(log = console.log) {
    generateDemoStories('vue', VUE_OUTPUT_DIR, '.vue', log);
});

// Run directly when executed as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const hasReact = args.includes('--react');
    const hasVue = args.includes('--vue');
    const both = !hasReact && !hasVue;
    if (hasReact || both) await generateReactDemoStories();
    if (hasVue || both) await generateVueDemoStories();
}
