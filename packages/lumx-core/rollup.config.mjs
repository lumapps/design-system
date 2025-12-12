import path from 'path';
import sass from 'sass';
import fs from 'fs/promises';
import glob from 'glob';
import postcss from 'postcss';

import typescript from '@rollup/plugin-typescript';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';

import pkg from './package.json' with { type: 'json' };
import CONFIGS from '../../configs/index.js';

const importUrl = new URL(import.meta.url);
const __dirname = path.dirname(importUrl.pathname);

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
const SRC_PATH = path.resolve(__dirname, 'src');

// Move internal modules to hash named files
function formatPath(entry) {
    if (entry.name.includes('_internal')) return '_internal/[hash].js';
    return '[name].js';
}

export default {
    // Bundle all TS files
    input: glob.sync('src/js/**/index.ts', {
        ignore: ['**/*.test.*', '**/_internal/**'],
    }),
    output: {
        format: 'esm',
        dir: DIST_PATH,
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: formatPath,
        chunkFileNames: formatPath,
    },
    // Externalize all dependencies
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || []),
    ].map((dependency) => new RegExp(`^${dependency}(/.*)?`)),
    plugins: [
        cleaner({ targets: [DIST_PATH] }),
        typescript({
            compilerOptions: {
                declaration: true,
                rootDir: SRC_PATH,
                outDir: DIST_PATH,
                target: 'ESNext',
                module: 'ESNext',
            },
            exclude: ['**/*.test.*'],
        }),
        copy({
            targets: [
                { src: path.join(ROOT_PATH, 'CONTRIBUTING.md'), dest: DIST_PATH },
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: DIST_PATH },
                { src: path.join(__dirname, 'README.md'), dest: DIST_PATH },
                { src: path.join(__dirname, 'package.json'), dest: DIST_PATH },
                { src: path.join(__dirname, 'src/{scss,css}'), dest: DIST_PATH },
            ],
        }),
        /**
         * Custom SASS to CSS builder plugin to handle `sass-mq` and a custom SCSS entry point not imported via JS/TS
         */
        {
            name: 'sass-builder',
            async buildEnd() {
                const input = 'src/scss/lumx.scss';
                const { css } = await sass.compileAsync(input, {
                    style: 'expanded',
                    importers: [{
                        findFileUrl: (url) => new URL(import.meta.resolve(url)),
                    }],
                });

                const { name } = path.parse(input);
                const outputPath = path.resolve(DIST_PATH, `${name}.css`);

                await fs.mkdir(path.dirname(outputPath), { recursive: true });

                const { css: postProcess } = await postcss(CONFIGS.postcss.plugins).process(css, { from: undefined });
                await fs.writeFile(outputPath, postProcess);
                console.log(`${path.relative(__dirname, input)} → ${path.relative(__dirname, DIST_PATH)}`);
            },
        },
    ],
};

