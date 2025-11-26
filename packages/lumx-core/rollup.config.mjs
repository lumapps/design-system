import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from 'path';
import sass from 'sass';
import fs from 'fs/promises';
import commonjs from '@rollup/plugin-commonjs';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import glob from 'glob';
import postcss from 'postcss';

import pkg from './package.json' with { type: 'json' };
import CONFIGS from '../../configs/index.js';

const importUrl = new URL(import.meta.url);
const __dirname = path.dirname(importUrl.pathname);

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
const extensions = ['.js', '.ts'];

// Custom SASS build to handle import of "sass-mq"
const sassPlugin = (input) => ({
    name: 'sass-builder',
    async buildEnd() {
        const customImporter = {
            findFileUrl: (url) => new URL(import.meta.resolve(url)),
        };

        const { css } = await sass.compileAsync(input, {
            style: 'expanded',
            importers: [customImporter],
        });

        const { name } = path.parse(input);
        const outputPath = path.resolve(DIST_PATH, `${name}.css`);

        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        const { css: postProcess } = await postcss(CONFIGS.postcss.plugins).process(css, { from: undefined });
        await fs.writeFile(outputPath, postProcess);
        console.log(`${path.relative(__dirname, input)} → ${path.relative(__dirname, DIST_PATH)}`);
    },
});


export default {
    // Bundle all TS files
    input: glob.sync('src/js/**/*.ts', {
        ignore: ['**/*.test.*'],
    }),
    output: {
        format: 'esm',
        dir: DIST_PATH,
        preserveModules: true,
        preserveModulesRoot: 'src',
    },
    // Externalize all dependencies
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies || []),
    ].map((dependency) => new RegExp(`^${dependency}(/.*)?`)),
    plugins: [
        cleaner({ targets: [DIST_PATH] }),
        sassPlugin('src/scss/lumx.scss'),
        nodeResolve({ browser: true, extensions }),
        commonjs({ include: /node_modules/ }),
        babel({
            extensions,
            exclude: /node_modules/,
            presets: ['@babel/preset-typescript'],
        }),
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

