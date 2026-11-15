/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        /** Use tsconfig path aliases natively. */
        tsconfigPaths: true,
    },
    /**
     * Core JSX is type-only (tsconfig `jsx: preserve`), and oxc keeps preserved JSX as is.
     * Tests only import constants from `.tsx` files, so compile JSX to classic calls that never run.
     */
    oxc: {
        jsx: { runtime: 'classic' },
    },
    test: {
        globals: true,
        passWithNoTests: true,
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            reporter: ['json', 'lcov', 'html', 'text'],
            reportsDirectory: './reports/coverage',
        },
        include: ['src/**/*.{test,spec}.{ts,js}'],
    },
});
