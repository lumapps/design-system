import { defineConfig } from 'vite';
import optimizeImportsLumxIcons from 'rollup-plugin-optimize-imports-lumx-icons';

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
    plugins: [
        /** Transform @lumx/icons imports to direct ESM imports. */
        optimizeImportsLumxIcons(),
    ],
});
