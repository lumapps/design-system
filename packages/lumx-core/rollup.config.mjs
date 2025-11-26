import path from 'path';
import sass from 'sass';
import fs from 'fs/promises';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import glob from 'glob';
import postcss from 'postcss';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' with { type: 'json' };
import CONFIGS from '../../configs/index.js';

const importUrl = new URL(import.meta.url);
const __dirname = path.dirname(importUrl.pathname);

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
const SRC_PATH = path.resolve(__dirname, 'src');
export const extensions = ['.js', '.ts'];

// Custom SASS build to handle import of "sass-mq"
const sassPlugin = (input) => ({
    name: 'sass-builder',
    async buildEnd() {
        const customImporter = {
            findFileUrl: (url) => new URL(import.meta.resolve(url)),
        };

        const compileSass = async (style) => {
            const { css } = await sass.compileAsync(input, {
                style,
                importers: [customImporter],
            });

            const { name } = path.parse(input);
            const extension = style === 'compressed' ? '.min.css' : '.css';
            const outputPath = path.resolve(DIST_PATH, `${name}${extension}`);

            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            const { css: postProcess } = await postcss(CONFIGS.postcss.plugins).process(css, { from: undefined });
            await fs.writeFile(outputPath, postProcess);
        };

        await Promise.all([compileSass('expanded'), compileSass('compressed')]);
        console.log(`${path.relative(__dirname, input)} → ${path.relative(__dirname, DIST_PATH)}`);
    },
});


export default {
    // Bundle all TS files
    input: Object.fromEntries(
        glob.sync('src/js/**/*.ts').map((file) => {
            const { dir, name } = path.parse(path.relative('src', file));
            return [path.join(dir, name), file];
        }),
    ),
    output: [
        {
            format: 'cjs',
            dir: DIST_PATH,
            entryFileNames: '[name].js',
        },
        {
            format: 'cjs',
            dir: DIST_PATH,
            entryFileNames: '[name].min.js',
            plugins: [terser()],
        },
    ],
    // Externalize all dependencies
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || []),
    ].map((dependency) => new RegExp(`^${dependency}(/.*)?`)),
    plugins: [
        cleaner({ targets: [DIST_PATH] }),
        sassPlugin('src/scss/lumx.scss'),
        commonjs({ include: /node_modules/ }),
        typescript({ target: 'ESNext', declaration: false }),
        copy({
            targets: [
                { src: path.join(ROOT_PATH, 'CONTRIBUTING.md'), dest: DIST_PATH },
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: DIST_PATH },
                { src: path.join(__dirname, 'README.md'), dest: DIST_PATH },
                { src: path.join(__dirname, 'package.json'), dest: DIST_PATH },
                { src: path.join(__dirname, 'src/*'), dest: DIST_PATH },
            ],
        }),
    ],
};

