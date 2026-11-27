/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

const COMMON_TEST_OPTIONS = {
    passWithNoTests: true,
    environment: 'jsdom',
    globals: true,
};

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            coverage: {
                reporter: ['json', 'lcov', 'html', 'text'],
                reportsDirectory: './reports/coverage',
            },
            projects: [
                {
                    extends: true,
                    test: {
                        ...COMMON_TEST_OPTIONS,
                        name: 'unit',
                        setupFiles: ['./vitest.setup.ts'],
                        include: ['src/**/*.{test,spec}.{ts,tsx}'],
                        exclude: ['src/**/*.stories.tsx'],
                    },
                },
                {
                    extends: true,
                    resolve: {
                        alias: [{ find: /^vue$/, replacement: '@vue/compat' }],
                        dedupe: ['vue'],
                    },
                    test: {
                        ...COMMON_TEST_OPTIONS,
                        name: 'compat',
                        setupFiles: ['./vitest.setup.ts', './vitest.compat.setup.ts'],
                        server: {
                            deps: {
                                inline: [/@testing-library\/vue/, /@vue\/test-utils/, /@vueuse\/core/, /@floating-ui\/vue/],
                            },
                        },
                        // Curated subset proven to run under `@vue/compat` with no `configureCompat` call.
                        include: [
                            'src/components/chip/Chip.test.ts',
                            'src/components/button/Button.test.ts',
                            'src/components/select-text-field/SelectTextField.test.tsx',
                            'src/components/menu-button/MenuButton.test.tsx',
                            'src/components/table/Table.test.ts',
                            'src/components/listbox/ListboxOption.test.tsx',
                            'src/compat/compat.test.tsx',
                        ],
                    },
                },
            ],
        },
    }),
);
