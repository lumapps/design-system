/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { createRequire } from 'module';
import * as sass from 'sass';
import fs from 'fs/promises';
import postcss from 'postcss';

import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fixEsmImports from 'rollup-plugin-lumx-fix-esm-imports';

import pkg from './package.json' with { type: 'json' };

// `configs/index.js` is CommonJS and dynamically requires its plugins; load it
// through `createRequire` at runtime so Vite's config bundler doesn't try to
// inline it (which breaks the dynamic `require` calls).
const require = createRequire(import.meta.url);

const importUrl = new URL(import.meta.url);
const __dirname = path.dirname(importUrl.pathname);

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const DIST_PATH = path.resolve(__dirname, 'dist');
const SRC_PATH = path.resolve(__dirname, 'src');

// Bundle entry points from the package.json `exports` field.
const input = Object.values(pkg.exports)
    .map((e) => (typeof e === 'object' ? e.default : undefined))
    .filter(Boolean)
    .map((importPath) => path.join(SRC_PATH, (importPath as string).replace(/index\.js$/, 'index.ts')));

// Externalize all dependencies (and peer dependencies).
const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys((pkg as { peerDependencies?: Record<string, string> }).peerDependencies || {}),
].map((dependency) => new RegExp(`^${dependency}(/.*)?`));

// Move internal modules to hash named files.
function formatPath(entry: { name: string }) {
    if (entry.name.includes('_internal')) return '_internal/[hash].js';
    return '[name].js';
}

/**
 * Custom SASS to CSS builder plugin to handle `sass-mq` and a custom SCSS entry point not imported via JS/TS.
 */
function sassBuilder(): Plugin {
    return {
        name: 'sass-builder',
        async closeBundle() {
            const inputs = ['src/scss/lumx.scss', 'src/scss/components-and-utils.scss'];

            for (const scssInput of inputs) {
                const { css } = await sass.compileAsync(scssInput, {
                    style: 'expanded',
                    importers: [
                        {
                            findFileUrl: (url) => new URL(import.meta.resolve(url)),
                        },
                    ],
                });

                const { name } = path.parse(scssInput);
                const outputPath = path.resolve(DIST_PATH, `${name}.css`);

                await fs.mkdir(path.dirname(outputPath), { recursive: true });

                const CONFIGS = require('../../configs/index.js');
                const { css: postProcess } = await postcss(CONFIGS.postcss.plugins).process(css, {
                    from: undefined,
                });
                await fs.writeFile(outputPath, postProcess);
                // eslint-disable-next-line no-console
                console.log(`${path.relative(__dirname, scssInput)} → ${path.relative(__dirname, DIST_PATH)}`);
            }
        },
    };
}

export default defineConfig({
    build: {
        outDir: DIST_PATH,
        // Disable minification to keep readable, source-like output
        minify: false,
        lib: {
            entry: input,
            formats: ['es'],
        },
        rollupOptions: {
            external,
            output: {
                format: 'esm',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: formatPath,
                chunkFileNames: formatPath,
            },
        },
    },
    plugins: [
        /** Resolve tsconfig path aliases (e.g. `@lumx/core/*` → `src/*`). */
        tsconfigPaths(),
        /** Generate per-file `.d.ts` declarations. */
        dts({
            include: input,
            compilerOptions: {
                declaration: true,
                rootDir: SRC_PATH,
            },
        }),
        /** Fix ESM imports to add .js extensions for lodash sub-module imports. */
        fixEsmImports(),
        /** Copy additional files to dist. */
        viteStaticCopy({
            targets: [
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: '.' },
                { src: path.join(__dirname, 'package.json'), dest: '.' },
                { src: path.join(__dirname, 'src/{scss,css}'), dest: '.' },
            ],
        }),
        /** Compile standalone SCSS entry points to CSS. */
        sassBuilder(),
    ],
});
