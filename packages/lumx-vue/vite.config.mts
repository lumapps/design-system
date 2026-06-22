import { defineConfig } from 'vite';
import optimizeImportsLumxIcons from 'vite-plugin-optimize-imports-lumx-icons';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fixEsmImports from 'vite-plugin-lumx-fix-esm-imports';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';

import path from 'path';

import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };

/** Set of lumx core exports */
const lumxCoreExports = new Set(Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)));

/** Lib entry points */
const entry = {
    index: 'src/index.ts',
    'utils/index': 'src/utils/index.ts',
};

/**
 * Vite config
 */
export default defineConfig({
    resolve: {
        /** Use tsconfig path aliases natively. */
        tsconfigPaths: true,
    },
    build: {
        lib: {
            entry,
            formats: ['es'],
        },
        outDir: 'dist',
        // Disable minification to keep readable, source-like output
        minify: false,
        rolldownOptions: {
            /**
             * Determine if an import should be treated as external (not bundled).
             * - @lumx/icons => external
             * - @lumx/core => only external if the given module is not in the @lumx/core package.json "exports"
             */
            external(id) {
                if (id === 'vue') return true;
                if (id.startsWith('@lumx/icons')) return true;
                if (lumxCoreExports.has(id)) return true;
                return false;
            },
            output: {
                format: 'esm',
                hoistTransitiveImports: false,
                dir: 'dist',
                chunkFileNames: '_internal/[hash].js',
            },
        },
    },
    plugins: [
        /** Fix ESM imports (e.g. lodash) */
        fixEsmImports(),
        vue(),
        vueJsx({
            // 1. Tell the Vue JSX compiler what function to use (h)
            // 2. Tell it to import 'h' from the 'vue' module
            // The default setup in modern Vue JSX handles this, but explicitly
            // ensuring the right runtime is used is key.
            babelPlugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'vue' }]],
        }),
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
        /** Bunld typescript declaration files */
        dts({
            include: Object.values(entry),
            aliasesExclude: [/@lumx\/core/],
            entryRoot: 'src',
            compilerOptions: {
                // No need to type check (CI does it)
                noCheck: true,
            },
        }),
        /** Copy additional files to dist. */
        viteStaticCopy({
            targets: [
                // dest:'dist' compensates for vite-plugin-static-copy prepending a '..' to dest when src is outside config.root.
                { src: '../../LICENSE.md', dest: 'dist' },
                { src: 'README.md', dest: '' },
                { src: 'package.json', dest: '' },
            ],
        }),
    ],
});
