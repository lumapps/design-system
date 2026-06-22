/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { createRequire } from 'module';
import * as sass from 'sass';
import fs from 'fs/promises';
import postcss from 'postcss';

import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fixEsmImports from 'vite-plugin-lumx-fix-esm-imports';

import pkg from './package.json' with { type: 'json' };

// Require CJS postcss.config file
const postcssConfig = createRequire(import.meta.url)('../../configs/postcss.config.js');

// Bundle entry points from the package.json `exports` field.
const input = Object.values(pkg.exports)
    .map((e) => (typeof e === 'object' ? e.default : undefined))
    .filter(Boolean)
    .map((importPath) => path.join('src', (importPath as string).replace(/index\..*$/, 'index')));

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
            const distPath = path.resolve(import.meta.dirname, 'dist');

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
                const outputPath = path.resolve(distPath, `${name}.css`);

                await fs.mkdir(path.dirname(outputPath), { recursive: true });

                const { css: postProcess } = await postcss(postcssConfig.plugins).process(css, {
                    from: undefined,
                });
                await fs.writeFile(outputPath, postProcess);
                // eslint-disable-next-line no-console
                console.log(`${scssInput} → dist`);
            }
        },
    };
}

export default defineConfig({
    resolve: {
        /** Use tsconfig path aliases natively. */
        tsconfigPaths: true,
    },
    build: {
        outDir: 'dist',
        // Disable minification to keep readable, source-like output
        minify: false,
        lib: {
            entry: input,
            formats: ['es'],
        },
        rolldownOptions: {
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
        /** Generate per-file `.d.ts` declarations. */
        dts({
            entryRoot: 'src',
            include: input.map(file => path.dirname(file)),
            compilerOptions: {
                // No need to type check (CI does it)
                noCheck: true,
            },
        }),
        /** Fix ESM imports to add .js extensions for lodash sub-module imports. */
        fixEsmImports(),
        /** Copy additional files to dist. */
        viteStaticCopy({
            targets: [
                // dest:'dist' compensates for vite-plugin-static-copy prepending a '..' to dest when src is outside config.root.
                { src: '../../LICENSE.md', dest: 'dist' },
                { src: 'package.json', dest: '' },
                { src: 'src/{scss,css}', dest: '' },
            ],
        }),
        /** Compile standalone SCSS entry points to CSS. */
        sassBuilder(),
    ],
});
