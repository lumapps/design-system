// Generate Storybook story files from site-demo component demos.
//
// Scans content/product/components/{name}/react/ and vue/ directories for demo files
// and generates corresponding .stories.tsx files in lumx-react and lumx-vue.
//
// Usage: node scripts/generate-demo-stories.js [--react] [--vue]
//   --react  Generate only React stories
//   --vue    Generate only Vue stories
//   (default: generate both)

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DEMO_DIR = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(SITE_DEMO_DIR, 'content/product/components');
const REACT_OUTPUT_DIR = path.resolve(SITE_DEMO_DIR, '../lumx-react/src/stories/demos-generated');
const VUE_OUTPUT_DIR = path.resolve(SITE_DEMO_DIR, '../lumx-vue/src/stories/demos-generated');

/** Cached relative paths from each output dir back to the site-demo components dir */
const REACT_PREFIX = path.relative(REACT_OUTPUT_DIR, COMPONENTS_DIR);
const VUE_PREFIX = path.relative(VUE_OUTPUT_DIR, COMPONENTS_DIR);

/**
 * List demo files in a framework subdirectory concurrently, sorted by number.
 * Returns an empty array if the directory does not exist.
 */
async function listDemoFiles(dir) {
    let files;
    try {
        files = await fsp.readdir(dir);
    } catch {
        return [];
    }
    const result = [];
    for (const f of files) {
        const match = f.match(/^demo(\d+)(\.(tsx|vue))$/);
        if (match) result.push({ number: Number(match[1]), name: f.slice(0, -match[2].length), ext: match[2] });
    }
    return result.sort((a, b) => a.number - b.number);
}

/** Generate stories file content */
function generateStories(componentFolder, demos, { prefix, fw, importExt }) {
    const imports = [
        `import { FlexBox } from '@lumx/${fw}/components/flex-box';`,
        "import { withWrapper } from '../decorators/withWrapper';",
        ...demos.map(
            (d) => `import Demo${d.number}Component from '${prefix}/${componentFolder}/${fw}/${d.name}${importExt}';`,
        ),
    ];

    const stories = demos
        .map((d) => `export const Demo${d.number} = { render: () => <Demo${d.number}Component /> };`)
        .join('\n');

    return [
        `// AUTO-GENERATED from site-demo — do not edit manually.`,
        ``,
        imports.join('\n'),
        ``,
        `export default {\n    title: 'LumX components/${componentFolder}/Demos',\n    decorators: [withWrapper({ vAlign: 'space-evenly', hAlign: 'center', wrap: true }, FlexBox)],\n};`,
        ``,
        stories,
        ``,
    ].join('\n');
}

/** Sorted list of component folder names */
function listComponentFolders() {
    return fs
        .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
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
 * Generate React demo story files.
 * @param {(msg: string) => void} [log] - Optional log function (e.g. Rollup's `this.info`). Falls back to `console.log`.
 */
export const generateReactDemoStories = once(async function generateReactDemoStories(log = console.log) {
    const componentFolders = listComponentFolders();
    fs.mkdirSync(REACT_OUTPUT_DIR, { recursive: true });

    // Scan all react/ subdirs concurrently, then write synchronously
    const demosByFolder = await Promise.all(
        componentFolders.map((folder) => listDemoFiles(path.join(COMPONENTS_DIR, folder, 'react'))),
    );

    let count = 0;
    for (let i = 0; i < componentFolders.length; i++) {
        const demos = demosByFolder[i];
        if (demos.length > 0) {
            fs.writeFileSync(
                path.join(REACT_OUTPUT_DIR, `${componentFolders[i]}.stories.tsx`),
                generateStories(componentFolders[i], demos, { prefix: REACT_PREFIX, fw: 'react', importExt: '' }),
            );
            count++;
        }
    }
    log(`Generated ${count} React demo story files in ${REACT_OUTPUT_DIR}`);
});

/**
 * Generate Vue demo story files.
 * @param {(msg: string) => void} [log] - Optional log function (e.g. Rollup's `this.info`). Falls back to `console.log`.
 */
export const generateVueDemoStories = once(async function generateVueDemoStories(log = console.log) {
    const componentFolders = listComponentFolders();
    fs.mkdirSync(VUE_OUTPUT_DIR, { recursive: true });

    // Scan all vue/ subdirs concurrently, then write synchronously
    const demosByFolder = await Promise.all(
        componentFolders.map((folder) => listDemoFiles(path.join(COMPONENTS_DIR, folder, 'vue'))),
    );

    let count = 0;
    for (let i = 0; i < componentFolders.length; i++) {
        const demos = demosByFolder[i];
        if (demos.length > 0) {
            fs.writeFileSync(
                path.join(VUE_OUTPUT_DIR, `${componentFolders[i]}.stories.tsx`),
                generateStories(componentFolders[i], demos, { prefix: VUE_PREFIX, fw: 'vue', importExt: '.vue' }),
            );
            count++;
        }
    }
    log(`Generated ${count} Vue demo story files in ${VUE_OUTPUT_DIR}`);
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
