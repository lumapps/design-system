import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fixEsmImports from 'vite-plugin-lumx-fix-esm-imports';
import path from 'path';
import { fileURLToPath } from 'url';

import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PATH = path.resolve(__dirname, '../..');
const SRC_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, 'dist');

/** Set of lumx core exports */
const lumxCoreExports = new Set(Object.keys(lumxCorePkg.exports).map((subpath) => path.join('@lumx/core', subpath)));

/** peer deps */
const peerDeps = Object.keys(pkg.peerDependencies || {});

/** Lib entry points */
const entry = {
    index: 'src/index.ts',
    'utils/index': 'src/utils/index.ts',
};

/**
 * Vite config
 *
 * Shared with Vitest and Storybook (with some override in the `viteFinal` of `.storybook/main.ts`)
 */
export default defineConfig({
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
    },
    build: {
        lib: {
            entry,
            formats: ['es'],
        },
        outDir: DIST_PATH,
        // Disable minification to keep readable, source-like output
        minify: false,
        rollupOptions: {
            /**
             * Determine if an import should be treated as external (not bundled).
             * - @lumx/icons => external
             * - @lumx/core => only external if the given module is not in the @lumx/core package.json "exports"
             */
            external(id) {
                if (peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))) return true;
                if (id.startsWith('@lumx/icons')) return true;
                if (lumxCoreExports.has(id)) return true;
                return false;
            },
            output: {
                format: 'esm',
                hoistTransitiveImports: false,
                dir: DIST_PATH,
                chunkFileNames: '_internal/[hash].js',
            },
        },
    },
    plugins: [
        fixEsmImports(),
        tsconfigPaths(),
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
        dts({
            include: Object.values(entry),
            aliasesExclude: [/@lumx\/core/],
            entryRoot: SRC_PATH,
        }),
        viteStaticCopy({
            targets: [
                { src: path.join(ROOT_PATH, 'LICENSE.md'), dest: '.' },
                { src: path.join(__dirname, 'README.md'), dest: '.' },
                { src: path.join(__dirname, 'package.json'), dest: '.' },
            ],
        }),
    ],
});
