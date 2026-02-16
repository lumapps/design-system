/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };
import fixEsmImports from 'rollup-plugin-lumx-fix-esm-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PATH = path.resolve(__dirname, '../..');
const DIST_PATH = path.resolve(__dirname, pkg.publishConfig.directory);
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/** Set of lumx core exports */
const lumxCoreExports = new Set(Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)));

/**
 * Vite config
 */
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            external(id) {
                if (id === 'vue') return true;
                if (id.startsWith('@lumx/icons')) return true;
                // @lumx/core imports are only external if they are available in the package.json "exports"
                if (lumxCoreExports.has(id)) return true;
                return false;
            },
            output: {
                format: 'esm',
                hoistTransitiveImports: false,
                dir: DIST_PATH,
                chunkFileNames: '_internal/[hash].js',
            },
            plugins: [
                /** Resolve source files. */
                nodeResolve({ browser: true, extensions }),
            ],
        },
    },
    plugins: [
        fixEsmImports(),
        vue(),
        vueJsx({
            // 1. Tell the Vue JSX compiler what function to use (h)
            // 2. Tell it to import 'h' from the 'vue' module
            // The default setup in modern Vue JSX handles this, but explicitly
            // ensuring the right runtime is used is key.
            babelPlugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'vue' }]],
        }),
        tsconfigPaths(),
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
        dts({
            exclude: ['src/**/*.stories.ts', 'src/**/*.test.ts', 'src/testing'],
            aliasesExclude: [/@lumx\/core/],
            entryRoot: 'src',
        }),
        viteStaticCopy({
            targets: [
                { src: path.join(ROOT_PATH, 'CONTRIBUTING.md'), dest: '.' },
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: '.' },
                { src: 'package.json', dest: '.' },
            ],
        }),
    ],
});
