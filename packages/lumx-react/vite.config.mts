import { defineConfig } from 'vite';
import optimizeImportsLumxIcons from 'vite-plugin-optimize-imports-lumx-icons';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fixEsmImports from 'vite-plugin-lumx-fix-esm-imports';

import pkg from './package.json' with { type: 'json' };
import lumxCorePkg from '../lumx-core/package.json' with { type: 'json' };

import path from 'path';

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
    resolve: {
        /** Use tsconfig path aliases natively. */
        tsconfigPaths: true,
    },
    oxc: {
        jsx: { runtime: 'automatic', importSource: 'react' },
        include: /\.[jt]sx?$/,
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
                if (peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))) return true;
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
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
        /** Generate per-file `.d.ts` declarations. */
        dts({
            entryRoot: 'src',
            include: Object.values(entry).map(file => path.dirname(file)),
            exclude: ['**/*.test.{ts,tsx}'],
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
