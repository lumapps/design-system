/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { storybookVis } from 'storybook-addon-vis/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from '../vite.config.mts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
    viteConfig,
    defineConfig({
        plugins: [
            /** Load stories as tests */
            storybookTest({ configDir: dirname }),
            /** Add storybook visual testing */
            storybookVis(),
        ],
        test: {
            name: '@lumx/vue storybook',
            root: path.join(dirname, '..'),
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
            setupFiles: [path.join(dirname, 'vitest.setup.ts')],
        },
    }),
);
