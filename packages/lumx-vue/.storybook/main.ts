import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import path from 'node:path';

const importUrl = new URL(import.meta.url);
const postcss = path.join('../..', importUrl.pathname, 'configs');

const config: StorybookConfig = {
    addons: ['@storybook/addon-a11y', '@chromatic-com/storybook'],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],
    framework: {
        name: '@storybook/vue3-vite',
        options: { docgen: false },
    },
    core: {
        disableWhatsNewNotifications: true,
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            css: { postcss },
        });
    },
};
export default config;
