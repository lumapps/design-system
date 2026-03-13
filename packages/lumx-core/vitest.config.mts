/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
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
