/**
 * Build the prebuilt MCP data file.
 *
 * Walks the React and Vue component sources through `@lumx/docgen`, collects the
 * site-demo MDX documentation and the style-dictionary design tokens, and writes
 * everything into `data/index.json` so the MCP server needs no design-system
 * sources at runtime.
 *
 * Usage: node scripts/generate.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { createProject } = require('@lumx/docgen/project.js');
const { parseReactComponent } = require('@lumx/docgen/react/docgen.js');
const { parseVueComponent } = require('@lumx/docgen/vue/docgen.js');

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const ROOT_PATH = path.resolve(DIRNAME, '../../..');
const OUTPUT_PATH = path.resolve(DIRNAME, '../data/index.json');

const FRAMEWORKS = {
    react: {
        packagePath: 'packages/lumx-react',
        parse: parseReactComponent,
        extension: '.tsx',
    },
    vue: {
        packagePath: 'packages/lumx-vue',
        parse: parseVueComponent,
        extension: '.tsx',
    },
};

const DOCS_PATH = 'packages/site-demo/content/product';
const TOKENS_PATH = 'packages/lumx-core/style-dictionary/properties';
const CSS_VARIABLES_PATH = 'packages/lumx-core/src/css/design-tokens.css';
const ICONS_PATH = 'packages/lumx-icons/dist/index.d.ts';
const MIGRATIONS_PATH = path.resolve(DIRNAME, '../data/migrations.json');

const IGNORED_FILE_RX = /\.(test|stories|spec)\.tsx?$/;

/** List the component source files of a framework package. */
function listComponentFiles({ packagePath, extension }) {
    const componentsDir = path.join(ROOT_PATH, packagePath, 'src/components');
    const files = [];

    for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const dir = path.join(componentsDir, entry.name);
        for (const file of fs.readdirSync(dir)) {
            if (!file.endsWith(extension) || IGNORED_FILE_RX.test(file)) continue;
            files.push({ slug: entry.name, filePath: path.join(dir, file) });
        }
    }

    return files;
}

/** Run docgen over every component of a framework. */
function collectComponents(framework, conf) {
    const project = createProject(path.join(ROOT_PATH, conf.packagePath));
    const components = [];
    const failures = [];

    for (const { slug, filePath } of listComponentFiles(conf)) {
        try {
            const result = conf.parse(project, filePath);
            if (!result) {
                failures.push({ filePath, reason: 'no props extracted' });
                continue;
            }
            components.push({
                name: result.displayName || path.basename(filePath, conf.extension),
                slug,
                framework,
                sourcePath: path.relative(ROOT_PATH, filePath),
                docs: result,
            });
        } catch (err) {
            failures.push({ filePath, reason: err.message });
        }
    }

    return { components, failures };
}

/** Collect the MDX documentation pages, keyed by their content path. */
function collectDocs() {
    const docsRoot = path.join(ROOT_PATH, DOCS_PATH);
    const pages = [];

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.name.endsWith('.mdx')) {
                const content = fs.readFileSync(full, 'utf8');
                const relative = path.relative(docsRoot, full);
                const [category, slug] = relative.split(path.sep);
                const frameworksLine = content.match(/^frameworks:\s*\[(.+)\]\s*$/m)?.[1];
                pages.push({
                    category,
                    slug: slug === 'index.mdx' ? category : slug.replace(/\/?index\.mdx$/, ''),
                    title: content.match(/^title:\s*(.+)$/m)?.[1]?.trim(),
                    frameworks: frameworksLine
                        ? frameworksLine.split(',').map((name) => name.trim().replace(/['"]/g, ''))
                        : undefined,
                    path: path.relative(ROOT_PATH, full),
                    content,
                });
            }
        }
    };
    walk(docsRoot);

    return pages;
}

/** Flatten the style-dictionary property files into a list of tokens. */
function collectTokens() {
    const tokensRoot = path.join(ROOT_PATH, TOKENS_PATH);
    const tokens = [];

    const flatten = (node, trail) => {
        if (node && typeof node === 'object' && 'value' in node) {
            tokens.push({ name: trail.join('-'), value: node.value, comment: node.comment });
            return;
        }
        if (!node || typeof node !== 'object') return;
        for (const [key, child] of Object.entries(node)) {
            flatten(child, [...trail, key]);
        }
    };

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.json')) flatten(JSON.parse(fs.readFileSync(full, 'utf8')), []);
        }
    };
    walk(tokensRoot);

    return tokens;
}

/**
 * Collect the site-demo example files: the framework-specific demos rendered on
 * design.lumapps.com. They are the canonical way to use each component, and they are the
 * one thing a consuming project cannot read from its own `node_modules`.
 */
function collectExamples() {
    const docsRoot = path.join(ROOT_PATH, DOCS_PATH);
    const examples = [];

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
                continue;
            }
            const framework = path.basename(path.dirname(full));
            if (framework !== 'react' && framework !== 'vue') continue;
            if (!/\.(tsx|vue)$/.test(entry.name)) continue;

            // .../product/components/button/react/high-emphasis.tsx -> slug "button"
            const componentSlug = path.basename(path.dirname(path.dirname(full)));
            examples.push({
                componentSlug,
                framework,
                name: entry.name.replace(/\.(tsx|vue)$/, ''),
                path: path.relative(ROOT_PATH, full),
                code: fs.readFileSync(full, 'utf8').trim(),
            });
        }
    };
    walk(docsRoot);

    return examples;
}

/**
 * Collect the `--lumx-*` CSS custom properties actually writable in a consumer's stylesheet,
 * resolving each `var(--other)` reference down to a literal value where possible.
 */
function collectCssVariables() {
    const css = fs.readFileSync(path.join(ROOT_PATH, CSS_VARIABLES_PATH), 'utf8');
    const declared = new Map();

    for (const [, name, rawValue] of css.matchAll(/^\s*(--lumx-[\w-]+)\s*:\s*([^;]+);/gm)) {
        declared.set(name, rawValue.trim());
    }

    /** Follow `var(--x)` references, guarding against cycles and missing targets. */
    const resolve = (name, seen = new Set()) => {
        if (seen.has(name)) return undefined;
        seen.add(name);
        const value = declared.get(name);
        if (value === undefined) return undefined;
        const reference = value.match(/^var\((--lumx-[\w-]+)\)$/);
        return reference ? resolve(reference[1], seen) ?? value : value;
    };

    return [...declared].map(([name, value]) => {
        const resolved = resolve(name);
        return { name, value, ...(resolved && resolved !== value ? { resolvedValue: resolved } : {}) };
    });
}

/** Collect the icon names exported by @lumx/icons, so they can be searched by meaning. */
function collectIcons() {
    const iconsPath = path.join(ROOT_PATH, ICONS_PATH);
    if (!fs.existsSync(iconsPath)) {
        process.stderr.write(`Warning: ${ICONS_PATH} missing. Run \`yarn build:icons\` to include icons.\n`);
        return [];
    }
    const declarations = fs.readFileSync(iconsPath, 'utf8');
    return [...declarations.matchAll(/^export declare const (\w+):/gm)].map(([, name]) => name);
}

/**
 * Load the curated legacy-tag replacement map, checking every target still names a real
 * component so the map cannot rot silently as components are renamed or removed.
 */
function collectMigrations(componentNames) {
    const migrations = JSON.parse(fs.readFileSync(MIGRATIONS_PATH, 'utf8'));
    const unknown = [...migrations.migrations, ...migrations.patterns]
        .filter((entry) => entry.to && !componentNames.has(entry.to))
        .map((entry) => `${entry.from} -> ${entry.to}`);

    if (unknown.length) {
        throw new Error(
            `data/migrations.json points at components that do not exist:\n  ${unknown.join('\n  ')}\n` +
                'Fix the `to` field or remove the entry.',
        );
    }

    return migrations;
}

const version = JSON.parse(fs.readFileSync(path.join(ROOT_PATH, 'package.json'), 'utf8')).version;
const allComponents = [];
const allFailures = [];

for (const [framework, conf] of Object.entries(FRAMEWORKS)) {
    process.stderr.write(`Parsing ${framework} components…\n`);
    const { components, failures } = collectComponents(framework, conf);
    allComponents.push(...components);
    allFailures.push(...failures.map((f) => ({ ...f, framework })));
    process.stderr.write(`  ${components.length} parsed, ${failures.length} skipped\n`);
}

const docs = collectDocs();
const tokens = collectTokens();
const examples = collectExamples();
const cssVariables = collectCssVariables();
const icons = collectIcons();
const migrations = collectMigrations(new Set(allComponents.map((component) => component.name)));

fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify({
        version,
        generatedAt: new Date().toISOString(),
        components: allComponents,
        docs,
        tokens,
        examples,
        cssVariables,
        icons,
        migrations,
    }),
);

process.stderr.write(
    `\nWrote ${path.relative(ROOT_PATH, OUTPUT_PATH)}:\n` +
        `  ${allComponents.length} components\n` +
        `  ${docs.length} doc pages\n` +
        `  ${examples.length} examples\n` +
        `  ${tokens.length} style-dictionary tokens\n` +
        `  ${cssVariables.length} CSS custom properties\n` +
        `  ${icons.length} icons\n` +
        `  ${migrations.migrations.length + migrations.patterns.length} migration entries\n`,
);

if (allFailures.length) {
    process.stderr.write(`\nSkipped ${allFailures.length} files:\n`);
    for (const { framework, filePath, reason } of allFailures) {
        process.stderr.write(`  [${framework}] ${path.relative(ROOT_PATH, filePath)}: ${reason}\n`);
    }
}
