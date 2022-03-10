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
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
export const extensions = ['.js', '.jsx', '.ts', '.tsx'];


/**
 * Compile index & compile separately every element exported by it.
 */
const input = Object.fromEntries([
    ['index', 'src/index.ts'],
    ['components', 'src/components/index.ts'],
    // All exported components:
    ...glob.sync('src/components/*/index.ts').map((componentPath) => {
        const [, componentName] = componentPath.match(/.*components\/(.*?)\/.*/) || [];
        return [componentName, componentPath];
    }),
    // Exported hooks:
    ['useFocusWithin', 'src/hooks/useFocusWithin.ts'],
]);

const isHookPath = (filePath) => filePath && filePath.includes('/hooks');
const transformHookPath = (filePath, newExtension = '') => filePath.replace(/.*src\/hooks\/([^/]*?)\.([tj]sx?)/, `hooks/$1.${newExtension || '$2'}`);

/**
 * Keep src/index and src/hooks/* at the root and move everything else to _internal
 * This facilitates tree shaking but detracts user from importing internal code directly.
 */
const renameFile = (info) => {
    const { name, facadeModuleId } = info;
    let dir = '';
    if (facadeModuleId && facadeModuleId.endsWith('src/index.ts')) {
        // Root file
        dir = '';
    } else if (isHookPath(facadeModuleId)) {
        // `hooks` in special folder
        dir = path.dirname(transformHookPath(facadeModuleId));
    } else {
        // Everything else into an _internal folder.
        dir = `esm/_internal/`;
    }
    const formattedName = facadeModuleId ? name : `${name.toLowerCase()}.${lodash.uniqueId()}`;
    return path.join(dir, `${formattedName}.js`);
};

// Bundle JS
const bundleJS = {
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
                    src: [path.join(__dirname, 'src'), '!**/*.snap', '!**/*.test.tsx', '!**/*.test.ts'],
                    dest: DIST_PATH,
                },
            ],
        }),
    ],
};

// Bundle types.
const bundleTypes = [
    // Root file
    // TODO: this produce better, stricter types than currently exported
    //   we need a major Lumx version announcing breaking change on types
    // { input: 'src/index.ts', output: 'index.d.ts' },
    // Hook files
    ...Object.values(input)
        .filter(isHookPath)
        .map((hookPath) =>
            ({ input: hookPath, output: transformHookPath(hookPath, 'd.ts') }),
        ),
]
    // Bundle TS types in D.TS files
    .map(({ input, output }) => ({
        input,
        output: {
            sourcemap: false,
            file: path.join(DIST_PATH, output),
            format: 'es',
        },
        plugins: [
            /** Externalize peer dependencies. */
            peerDepsExternal(),
            /** Resolve tsconfig paths. */
            tsPathsResolve(),
            /** Transform TS to D.TS file. */
            dts({ respectExternal: true }),
        ],
    }));

export default [bundleJS, ...bundleTypes];
