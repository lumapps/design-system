import path from 'path';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import cleaner from 'rollup-plugin-cleaner';
import dts from 'rollup-plugin-dts';

import pkg from './package.json';

const CONFIGS = require('../../configs');

const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
export const extensions = ['.js', '.ts'];

// Bundle MDI icons, our override & aliases into a single ESM & CJS bundle
const bundleJS = {
    input: 'index.ts',
    output: [
        // ESM version
        {
            format: 'esm',
            sourcemap: true,
            dir: DIST_PATH,
        },
        // CommonJS version
        {
            format: 'cjs',
            sourcemap: true,
            dir: path.join(DIST_PATH, 'cjs'),
        },
    ],
    plugins: [
        /** Clean dist dir */
        cleaner({ targets: [DIST_PATH] }),
        /** Resolve source files. */
        resolve({ browser: true, extensions }),
        /** Transpile JS. */
        babel({
            extensions,
            exclude: /node_modules/,
            plugins: CONFIGS.babel.plugins,
            presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                '@babel/preset-typescript',
            ],
        }),
        /** Copy additional files to dist. */
        copy({
            targets:
                // Add package.json, SCSS (not bundled by build) and MDs
                glob.sync('*(package.json|*.scss|*.md)')
                    // Add generated SCSS & fonts
                    .concat(glob.sync('override/generated/{*.scss,fonts}'))
                    // Make it relative to dist dir
                    .map(file => ({
                        src: path.join(__dirname, file),
                        dest: path.join(DIST_PATH, path.dirname(file))
                    })),
        }),
    ],
};

// Mirror JS bundle but with `.d.ts` declaration files
const bundleType = {
    input: 'index.ts',
    output: [
        // ESM version
        {
            format: 'esm',
            dir: DIST_PATH,
        },
        // CommonJS version
        {
            format: 'cjs',
            dir: path.join(DIST_PATH, 'cjs'),
        },
    ],
    plugins: [
        /** Transform TS to D.TS file. */
        dts({ respectExternal: true }),
    ],
};

export default [bundleJS, bundleType];
