/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';

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
        tsconfigPaths(),
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
    ],
});
