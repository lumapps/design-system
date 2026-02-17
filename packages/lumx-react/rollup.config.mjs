import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import analyze from 'rollup-plugin-analyzer';
import { babel } from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { tsPathsResolve } from 'rollup-plugin-ts-paths-resolve';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';
import fixEsmImports from 'rollup-plugin-lumx-fix-esm-imports';

import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };

const importUrl = new URL(import.meta.url);
const __dirname = path.dirname(importUrl.pathname);

const ROOT_PATH = path.resolve(__dirname, '..', '..');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/**
 * List of entry modules that will get compiled and exported to NPM.
 * All other modules are considered as internal and won't be exposed.
 */
const input = {
    index: 'src/index.ts', // => @lumx/react
    'utils/index': 'src/utils/index.ts', // => @lumx/react/utils
};

/** Set of lumx core exports */
const lumxCoreExports = new Set(Object.keys(lumxCorePkg.exports).map(
    (subpath) => path.join('@lumx/core', subpath),
));

/**
 * Determine if an import should be treated as external (not bundled).
 * - @lumx/icons => externa
 * - @lumx/core => only external if the given module is not in the @lumx/core package.json "exports"
 */
function external(id) {
    if (id.startsWith('@lumx/icons')) return true;
    if (lumxCoreExports.has(id)) return true;
    return false;
}

// Bundle JS code
const bundleJS = {
    input,
    external,
    output: {
        format: 'esm',
        sourcemap: true,
        hoistTransitiveImports: false,
        dir: DIST_PATH,
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
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
        /** Resolve source files. */
        nodeResolve({ browser: true, extensions }),
        /** Resolve commonjs dependencies. */
        commonjs({ include: /node_modules/ }),
        /** Transpile JS/TS. */
        babel({
            extensions,
            exclude: /node_modules/,
            presets: [['@babel/react', { runtime: 'automatic' }], '@babel/preset-typescript'],
        }),
        /** Fix ESM imports to add .js extensions and /index.js for directory imports */
        fixEsmImports(),
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
    external,
    output: {
        format: 'esm',
        dir: DIST_PATH,
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
