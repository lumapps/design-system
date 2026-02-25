import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { storybookVis } from 'storybook-addon-vis/vitest-plugin';
import path from 'node:path';

// When SNAPSHOT_ONLY is set, only include stories with the 'snapshot' tag (skip play-test-only stories).
const snapshotOnly = !!process.env.SNAPSHOT_ONLY;
const tags = snapshotOnly ? { include: ['snapshot'] } : undefined;

/**
 * Create a vitest config for storybook browser testing with visual snapshots.
 *
 * @param {object} options
 * @param {string} options.name - Vitest project name (e.g. '@lumx/react storybook')
 * @param {string} options.configDir - Path to the .storybook directory
 * @param {import('vitest/config').UserConfig} options.viteConfig - Base vite config to merge with
 */
export function createStorybookVitestConfig(options) {
    const { name, configDir, viteConfig } = options;
    return mergeConfig(
        viteConfig,
        defineConfig({
            plugins: [
                /** Load stories as tests */
                storybookTest({ configDir, tags }),
                /** Add storybook visual testing */
                storybookVis(),
            ],
            test: {
                name,
                root: path.join(configDir, '..'),
                browser: {
                    enabled: true,
                    provider: playwright({
                        contextOptions: {
                            // Reduce animations (not great in screenshots)
                            reducedMotion: 'reduce',
                        },
                    }),
                    headless: true,
                    instances: [{ browser: 'chromium' }],
                },
                setupFiles: [path.join(configDir, 'vitest.setup.ts')],
            },
        }),
    );
}
