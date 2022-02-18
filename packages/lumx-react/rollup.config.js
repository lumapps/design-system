import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import glob from 'glob';
import lodash from 'lodash';
import path from 'path';
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
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
export const extensions = ['.js', '.jsx', '.ts', '.tsx'];


/**
 * Compile index & compile separately every elements exported by it.
 */
const input = Object.fromEntries([
    ['index', 'src/index.ts'],
    ['components', 'src/components/index.ts'],
    ...glob.sync('src/components/*/index.ts').map((componentPath) => {
        const [, componentName] = componentPath.match(/.*components\/(.*?)\/.*/) || [];
        return [componentName, componentPath];
    }),
    /*...glob.sync('src/hooks/*.ts').map((hookPath) => {
        const hookName = path.basename(hookPath).replace(/(.tsx?)$/, '');
        return [hookName, hookPath];
    }),*/
]);

/**
 * Keep src/index and src/hooks/* at the root and move everything else to _internal
 * This facilitates tree shaking but detracts user from importing internal code directly.
 */
const renameFile = (info) => {
    const { name, facadeModuleId = '' } = info;
    let dir = '';
    if (facadeModuleId.endsWith('src/index.ts')) {
        // Root file
        dir = '';
    } else if (facadeModuleId.includes('hooks')) {
        // `hooks` in special folder
        dir = `hooks/`;
    } else {
        // Everything else into an _internal folder.
        dir = `_internal/`;
    }
    // Bundle on
    let formattedName = facadeModuleId ? name : `${name.toLowerCase()}.${lodash.uniqueId()}`;
    return `${dir}${formattedName}.js`;
};

export default [
    {
        input,
        output: {
            format: 'esm',
            sourcemap: true,
            dir: DIST_PATH,
            chunkFileNames: renameFile,
            entryFileNames: renameFile,
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
                    {
                        src: [path.join(__dirname, 'src'), '!**/*.snap', '!**/*.test.tsx', '!**/*.test.ts', '!**/*.stories.tsx'],
                        dest: DIST_PATH,
                    },
                ],
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: [{ file: path.join(DIST_PATH, 'index.d.ts'), format: 'es' }],
        plugins: [dts()],
    },
    ...glob.sync('src/hooks/*.ts').map((hookPath) => {
        const hookName = path.basename(hookPath, '.ts');
        return {
            input: hookPath,
            output: [{ file: path.join(DIST_PATH, 'hooks', `${hookName}.d.ts`), format: 'es' }],
            plugins: [dts()],
        };
    }),
];
