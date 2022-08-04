import path from 'path';
import glob from 'glob';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import cleaner from 'rollup-plugin-cleaner';

import pkg from './package.json';

const CONFIGS = require('../../configs');

const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
export const extensions = ['.js'];

export default {
    input: 'index.js',
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
            ],
        }),
        /** Copy additional files to dist. */
        copy({
            targets: glob.sync('*(package.json|*.js|*.d.ts|*.scss|*.md)')
                .map(file => ({ src: path.join(__dirname, file), dest: DIST_PATH })),
        }),
    ],
};
