#!/usr/bin/env node
/**
 * LumX design system MCP server.
 *
 * Serves the prebuilt `data/index.json` over stdio so any MCP client (Claude Code,
 * Claude Desktop…) can look up component props, documentation and design tokens
 * without having the design-system sources checked out.
 *
 * The server detects the consuming project's framework (see `detect-framework.js`) and
 * serves only that framework's components, so a Vue project never sees React props and
 * vice versa. Set `LUMX_FRAMEWORK=react|vue|all` to override the detection.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { detectFramework } from './detect-framework.js';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(DIRNAME, '../data/index.json');

if (!fs.existsSync(DATA_PATH)) {
    process.stderr.write(`Missing ${DATA_PATH}. Run \`yarn generate\` in @lumx/mcp first.\n`);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const { framework: lockedFramework, source: detectionSource } = detectFramework();

process.stderr.write(
    lockedFramework
        ? `LumX MCP: serving ${lockedFramework} components only (detected from ${detectionSource}).\n`
        : `LumX MCP: serving all frameworks (${detectionSource}).\n`,
);

/** Components visible to this session, already narrowed to the detected framework. */
const components = lockedFramework
    ? data.components.filter((component) => component.framework === lockedFramework)
    : data.components;

/** Documentation pages, dropping the ones that do not cover the detected framework. */
const docs = lockedFramework
    ? data.docs.filter((page) => !page.frameworks || page.frameworks.includes(lockedFramework))
    : data.docs;

/** Example files, narrowed to the detected framework. */
const examples = lockedFramework
    ? data.examples.filter((example) => example.framework === lockedFramework)
    : data.examples;

/** Legacy-tag replacements, plus the kebab-case aliases LumX registers globally in Vue. */
const migrations = [
    ...data.migrations.migrations,
    ...[...new Set(components.map((component) => component.name))].map((name) => ({
        from: `lx-${name.replace(/(?<!^)[A-Z]/g, (letter) => `-${letter}`).toLowerCase()}`,
        to: name,
        confidence: 'confirmed',
        note: 'Same component, written as the kebab-case tag LumX registers globally in Vue.',
    })),
];

/** Mentioned in every tool description so the model knows what it is and is not seeing. */
const frameworkNote = lockedFramework
    ? ` This project uses ${lockedFramework}, so only ${lockedFramework} components are served.`
    : ' This project is not pinned to a framework, so both react and vue components are served.';

const text = (value) => ({
    content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

const matches = (component, name) =>
    component.name.toLowerCase() === name.toLowerCase() || component.slug === name.toLowerCase();

/**
 * Build the optional `framework` input. When the project is pinned there is nothing to
 * choose, so the argument is left out of the schema entirely.
 */
const frameworkInput = lockedFramework
    ? {}
    : { framework: z.enum(['react', 'vue']).optional().describe('Restrict the result to this framework') };

/** Narrow a list of components further, if the caller asked for a framework. */
const byFramework = (list, framework) =>
    framework ? list.filter((component) => component.framework === framework) : list;

const server = new McpServer({ name: 'lumx', version: data.version });

server.registerTool(
    'list_components',
    {
        title: 'List LumX components',
        description:
            'List the components available in the LumX design system. ' +
            'Use this first to discover the exact component name to pass to the other tools.' +
            frameworkNote,
        inputSchema: frameworkInput,
    },
    async ({ framework }) => {
        const byName = new Map();
        for (const component of byFramework(components, framework)) {
            const entry = byName.get(component.name) || { name: component.name, slug: component.slug, frameworks: [] };
            entry.frameworks.push(component.framework);
            byName.set(component.name, entry);
        }
        const found = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
        return text({ framework: lockedFramework || framework || 'all', total: found.length, components: found });
    },
);

server.registerTool(
    'get_component_props',
    {
        title: 'Get LumX component props',
        description:
            'Get the full prop API of a LumX component: prop names, types, default values, required flags, ' +
            'JSDoc descriptions and deprecations.' +
            frameworkNote,
        inputSchema: {
            name: z.string().describe('Component name or slug, e.g. "Button" or "text-field"'),
            ...frameworkInput,
        },
    },
    async ({ name, framework }) => {
        const found = byFramework(components, framework).filter((component) => matches(component, name));
        if (!found.length) {
            const scope = lockedFramework ? ` in ${lockedFramework}` : '';
            return text(`No component named "${name}"${scope}. Call list_components to see the available names.`);
        }
        return text(
            found.map((component) => ({
                name: component.name,
                framework: component.framework,
                sourcePath: component.sourcePath,
                ...component.docs,
            })),
        );
    },
);

server.registerTool(
    'get_component_docs',
    {
        title: 'Get LumX component documentation',
        description:
            'Get the authored documentation page for a LumX component or foundation: usage guidance, ' +
            "do/don't rules and code examples, as MDX source." +
            frameworkNote,
        inputSchema: {
            name: z.string().describe('Component or page slug, e.g. "button", "colors", "spacing"'),
        },
    },
    async ({ name }) => {
        const slug = name.toLowerCase();
        const page =
            docs.find((doc) => doc.slug === slug) ||
            docs.find((doc) => doc.title?.toLowerCase() === slug) ||
            docs.find((doc) => doc.slug.includes(slug));
        if (!page) {
            const available = docs.map((doc) => doc.slug).join(', ');
            return text(`No documentation page for "${name}". Available pages: ${available}`);
        }
        return text(`# ${page.title || page.slug}\n\nSource: ${page.path}\n\n${toProse(page.content)}`);
    },
);

server.registerTool(
    'search_design_tokens',
    {
        title: 'Search LumX design tokens',
        description:
            'Search the LumX design tokens by name or value. Returns the `--lumx-*` CSS custom properties ' +
            'you can write directly in a stylesheet (with each `var()` reference resolved to its literal ' +
            'value), and optionally the style-dictionary source tokens behind them. ' +
            'Use this instead of hardcoding a colour, spacing, radius or size.',
        inputSchema: {
            query: z
                .string()
                .describe('Substring matched against names and values, e.g. "color-dark", "spacing", "#fff"'),
            kind: z
                .enum(['css', 'source', 'all'])
                .default('css')
                .describe('"css" for usable --lumx-* properties, "source" for style-dictionary tokens, "all" for both'),
            limit: z.number().int().positive().max(200).default(50).describe('Maximum number of results'),
        },
    },
    async ({ query, kind, limit }) => {
        const needle = query.toLowerCase();
        const hit = (name, value) =>
            name.toLowerCase().includes(needle) || String(value).toLowerCase().includes(needle);

        const cssResults =
            kind === 'source'
                ? []
                : data.cssVariables
                      .filter((variable) => hit(variable.name, variable.resolvedValue ?? variable.value))
                      .map((variable) => ({ kind: 'css', usage: `var(${variable.name})`, ...variable }));

        const sourceResults =
            kind === 'css'
                ? []
                : data.tokens
                      .filter((token) => hit(token.name, token.value))
                      .map((token) => ({ kind: 'source', ...token }));

        const found = [...cssResults, ...sourceResults];
        return text({ total: found.length, returned: Math.min(found.length, limit), tokens: found.slice(0, limit) });
    },
);

server.registerTool(
    'get_component_examples',
    {
        title: 'Get LumX component usage examples',
        description:
            'Get the canonical, runnable usage examples for a LumX component, taken from the design system ' +
            'documentation site. Read these before writing the markup: they show which props a component needs ' +
            'to render correctly (an IconButton with no `emphasis`, for instance, renders with no background).' +
            frameworkNote,
        inputSchema: {
            name: z.string().describe('Component name or slug, e.g. "Button" or "text-field"'),
        },
    },
    async ({ name }) => {
        const slug = name.toLowerCase();
        const component = components.find((candidate) => matches(candidate, slug));
        const componentSlug = component?.slug || slug;
        const found = examples.filter((example) => example.componentSlug === componentSlug);

        if (!found.length) {
            return text(
                `No examples for "${name}". The component may exist without documented examples; ` +
                    'call get_component_props for its API.',
            );
        }
        return text(
            found
                .map(
                    (example) =>
                        `## ${example.name} (${example.framework})\n\nSource: ${example.path}\n\n\`\`\`\n${example.code}\n\`\`\``,
                )
                .join('\n\n'),
        );
    },
);

server.registerTool(
    'search_icons',
    {
        title: 'Search LumX icons',
        description:
            'Find an icon exported by @lumx/icons by meaning, e.g. "phone", "close", "arrow". ' +
            "Always use the returned name (`import { mdiPhone } from '@lumx/icons'`) rather than " +
            'inlining a raw SVG path.',
        inputSchema: {
            query: z.string().describe('What the icon depicts, e.g. "phone", "trash", "chevron"'),
            limit: z.number().int().positive().max(100).default(30).describe('Maximum number of results'),
        },
    },
    async ({ query, limit }) => {
        const needle = query.toLowerCase().replace(/^mdi/, '');
        const found = data.icons.filter((icon) => icon.toLowerCase().includes(needle));
        // An exact-ish name is far more useful than an alphabetical prefix match, so rank short names first.
        found.sort((a, b) => a.length - b.length || a.localeCompare(b));
        return text({ total: found.length, icons: found.slice(0, limit) });
    },
);

server.registerTool(
    'find_lumx_replacement',
    {
        title: 'Find the LumX replacement for a legacy component',
        description:
            'Look up which LumX component replaces a legacy Beekeeper (`bkpr-*`) or kebab-case (`lx-*`) tag, ' +
            'or a legacy markup pattern. Use it when migrating existing markup to LumX. ' +
            'A `suggested` confidence means the mapping still needs a human to check the details.',
        inputSchema: {
            tag: z
                .string()
                .optional()
                .describe('The legacy tag to replace, e.g. "bkpr-clickable-icon". Omit to list every mapping.'),
        },
    },
    async ({ tag }) => {
        if (!tag) {
            return text({ migrations, patterns: data.migrations.patterns });
        }
        const needle = tag.toLowerCase().replace(/[<>/]/g, '').trim();
        const found = migrations.filter((entry) => entry.from.toLowerCase().includes(needle));
        if (!found.length) {
            return text(
                `No mapping for "${tag}". Call find_lumx_replacement with no argument to see every known ` +
                    'mapping, or list_components to look for a replacement yourself.',
            );
        }
        return text({ matches: found, patterns: data.migrations.patterns });
    },
);

/**
 * Turn an MDX documentation page into readable prose.
 *
 * The raw page opens with a dozen `import` lines for its demo files and refers to them
 * through `<DemoBlock>`. Neither carries guidance, so both are replaced with a pointer to
 * `get_component_examples`, which serves the demo code itself.
 */
function toProse(content) {
    return content
        .replace(/^---\n[\s\S]*?\n---\n/, '')
        .split('\n')
        .filter((line) => !/^import\s/.test(line))
        .join('\n')
        .replace(/<DemoBlock[\s\S]*?\/>/g, '_(example available via get_component_examples)_')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

await server.connect(new StdioServerTransport());
