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
import MagicString from 'magic-string';
import type { Plugin } from 'vite';
import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };
import fixEsmImports from 'rollup-plugin-lumx-fix-esm-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PATH = path.resolve(__dirname, '../..');
const DIST_PATH = path.resolve(__dirname, 'dist');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const CREATE_VNODE_PATH = fileURLToPath(new URL('./src/utils/compat/createVNode.ts', import.meta.url));

/**
 * Every JSX vnode goes through the `__lumxCreateVNode` pragma (set below), but the JSX transform
 * adds no import for it. This plugin appends that import, with the absolute path of the wrapper
 * and not the `@lumx/vue/...` alias: `vite-tsconfig-paths` resolves an alias with the tsconfig of
 * the importing file, and the `@lumx/core` `.tsx` files sit in `packages/lumx-core`, where that
 * alias can be absent.
 */
function injectLumxCreateVNode(): Plugin {
    return {
        name: 'inject-lumx-create-vnode',
        transform(code, id) {
            const [filePath] = id.split('?');
            if (filePath === CREATE_VNODE_PATH || !code.includes('__lumxCreateVNode(')) {
                return null;
            }

            // Appended at the end, not the top: an import declaration is hoisted, so appending
            // keeps every other line at its place and the JSX transform's source map valid.
            const s = new MagicString(code);
            s.append(`\nimport { __lumxCreateVNode } from '${CREATE_VNODE_PATH}';\n`);
            return {
                code: s.toString(),
                map: s.generateMap({ hires: true }),
            };
        },
    };
}

/** Set of lumx core exports */
const lumxCoreExports = new Set(Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)));

/**
 * Vite config
 */
export default defineConfig({
    build: {
        lib: {
            entry: {
                index: 'src/index.ts',
                'utils/index': 'src/utils/index.ts',
            },
            formats: ['es'],
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
            // Routes every JSX vnode through `__lumxCreateVNode`, which marks a function
            // component for Vue 3 behaviour before `@vue/compat` can read it as a Vue 2 one.
            pragma: '__lumxCreateVNode',
        }),
        injectLumxCreateVNode(),
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
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: '.' },
                { src: 'package.json', dest: '.' },
            ],
        }),
    ],
});
