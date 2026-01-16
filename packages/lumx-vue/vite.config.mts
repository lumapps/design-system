/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';

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
    ],
});
