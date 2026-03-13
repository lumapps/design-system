/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';

/**
 * Vite config
 *
 * Shared with Vitest and Storybook (with some override in the `viteFinal` of `.storybook/main.ts`)
 */
export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    oxc: {
        jsx: {
            runtime: 'automatic',
            importSource: 'react',
        },
    },
    plugins: [
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
    ],
});
