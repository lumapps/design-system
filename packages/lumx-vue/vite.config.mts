/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PATH = path.resolve(__dirname, '../..');

/**
 * Vite config
 *
 * Shared with Vitest and Storybook (with some override in the `viteFinal` of `.storybook/main.ts`)
 */
export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            reporter: ['json', 'lcov', 'html', 'text'],
            reportsDirectory: './reports/coverage',
        },
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['src/**/*.stories.tsx'],
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            external: [/^@lumx\/icons/, 'vue', 'lodash'],
            output: {
                chunkFileNames: '_internal/[hash].js',
            },
        },
    },
    plugins: [
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
