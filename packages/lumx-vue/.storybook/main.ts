import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';

import postcss from './postcss.config';

const config: StorybookConfig = {
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@chromatic-com/storybook',
    ],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    framework: '@storybook/vue3-vite',
    docs: false,
    async viteFinal(config) {
        const vueDocgenIndex = config.plugins?.findIndex(({ name }) => name === 'storybook:vue-docgen-plugin')
        if (vueDocgenIndex !== -1) {
            config.plugins?.splice(vueDocgenIndex, 1);
        }

        return mergeConfig(config, {
            optimizeDeps: { include: ['@lumx/icons'] },
            css: { postcss },
        });
    },
};
export default config;
