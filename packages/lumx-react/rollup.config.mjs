import path from 'path';
import glob from 'glob';

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import analyze from 'rollup-plugin-analyzer';
import { babel } from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { tsPathsResolve } from 'rollup-plugin-ts-paths-resolve';

import pkg from './package.json' with { type: 'json' };

const importUrl = new URL(import.meta.url);
const __dirname = path.dirname(importUrl.pathname);

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const SRC_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
export const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const INTERNAL = '_internal';

const entries = [
    ['index', 'src/index.ts'],             // => @lumx/react
    ['utils/index', 'src/utils/index.ts'], // => @lumx/react/utils
]

/**
 * List of entry modules that will get compiled and exported to NPM.
 * All other modules are considered as internal and won't be exposed.
 */
const input = Object.fromEntries([
    // Externals
    ...entries,
    // Internals (split to help bundler tree-shake)
    ...glob.sync('src/components/*/index.ts').map((componentPath) => {
        const relativePath = path.relative(SRC_PATH, componentPath);
        return [`${INTERNAL}/${path.dirname(relativePath)}`, componentPath];
    }),
]);

const formatFileNames = (ext) => (info) => {
    if (info.name.startsWith(INTERNAL)) {
        return `[name]-[hash].${ext}`;
    }
    return `[name].${ext}`;
};

// Bundle JS code
const bundleJS = {
    input,
    output: {
        format: 'esm',
        sourcemap: true,
        hoistTransitiveImports: false,
        dir: DIST_PATH,
        // Unnamed chunk moved to `_internal` folder
        chunkFileNames: `_internal/[name]-[hash].js`,
        entryFileNames: formatFileNames('js'),
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
        nodeResolve({ browser: true, extensions }),
        /** Resolve commonjs dependencies. */
        commonjs({ include: /node_modules/ }),
        /** Transpile JS/TS. */
        babel({
            extensions,
            exclude: /node_modules/,
            presets: [
                ['@babel/react', { runtime: 'automatic'}],
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
    input: Object.fromEntries(entries),
    output: {
        format: 'esm',
        dir: DIST_PATH,
        // Unnamed chunk moved to `_internal` folder
        chunkFileNames: `_internal/[name]-[hash].d.ts`,
        entryFileNames: formatFileNames('d.ts'),
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
