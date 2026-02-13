/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            name: '@lumx/react',
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
    }),
);
