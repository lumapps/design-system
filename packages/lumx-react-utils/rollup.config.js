import path from 'path';
import glob from 'glob';
import lodash from 'lodash';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import analyze from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import tsPathsResolve from 'rollup-plugin-ts-paths-resolve';

import pkg from './package.json';

const CONFIGS = require('../../configs');

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const SRC_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
export const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/**
 * List entry points (modules exposed to the NPM package):
 */
const input = ['src/index.ts'].concat(
    // Hooks are compiled separately and exposed in th NPM package
    glob.sync('src/hooks/*.[tj]s')
);


// Bundle JS
const bundleJS = {
    input,
    output: {
        format: 'esm',
        sourcemap: true,
        dir: DIST_PATH,
        // Keep directory from /src into /dist
        entryFileNames(info) {
            const dir = path.dirname(path.relative(SRC_PATH, info.facadeModuleId));
            return path.join(
                // Dir path from src folder or empty if root src folder.
                dir === '.' ? '': dir,
                `[name].js`
            );
        },
        // Unnamed chunk moved to `_internal` folder
        chunkFileNames: '_internal/[hash].js',
    },
    plugins: [
        /** Clean dist dir */
        cleaner({ targets: [DIST_PATH] }),
        /** Externalize peer dependencies. */
        peerDepsExternal(),
        /** Analyze created bundle. */
        analyze(),
        /** Resolve tsconfig paths. */
        tsPathsResolve(),
        /** Resolve source files. */
        resolve({ browser: true, extensions }),
        /** Resolve commonjs dependencies. */
        commonjs({ include: /node_modules/ }),
        /** Transpile JS/TS. */
        babel({
            extensions,
            exclude: /node_modules/,
            plugins: CONFIGS.babel.plugins,
            presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                '@babel/preset-react',
                '@babel/preset-typescript',
            ],
        }),
        /** Copy additional files to dist. */
        copy({
            targets: [
                { src: path.join(ROOT_PATH, 'CONTRIBUTING.md'), dest: DIST_PATH },
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: DIST_PATH },
                { src: path.join(__dirname, 'README.md'), dest: DIST_PATH },
                { src: path.join(__dirname, 'package.json'), dest: DIST_PATH },
            ],
        }),
    ],
};

// Bundle TS types in D.TS files
const bundleType = {
    input,
    output: {
        dir: DIST_PATH,
        format: 'es',
        // Keep directory from /src into /dist
        entryFileNames(info) {
            const relativePathModule = path.relative(SRC_PATH, info.facadeModuleId);
            return relativePathModule.replace(/(\.\w+)*$/, '.d.ts');
        },
        // Unnamed chunk moved to `_internal` folder
        chunkFileNames: '_internal/[hash].d.ts',
    },
    plugins: [
        /** Externalize peer dependencies. */
        peerDepsExternal(),
        /** Resolve tsconfig paths. */
        tsPathsResolve(),
        /** Transform TS to D.TS file. */
        dts({ respectExternal: true }),
    ],
};

export default [bundleJS, bundleType];
