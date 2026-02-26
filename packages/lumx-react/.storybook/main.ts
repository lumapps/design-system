import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig, type Plugin } from 'vite';
import path from 'node:path';
import { generateReactDemoStories } from '../../site-demo/scripts/generate-demo-stories.mjs';

const importUrl = new URL(import.meta.url);
const postcss = path.join('../..', importUrl.pathname, 'configs');

const config: StorybookConfig = {
    addons: ['@storybook/addon-a11y', '@chromatic-com/storybook'],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],
    framework: '@storybook/react-vite',
    core: {
        disableWhatsNewNotifications: true,
    },

    async viteFinal(config) {
        return mergeConfig(config, {
            css: { postcss },
            plugins: [
                {
                    name: 'generate-demo-stories',
                    async buildStart() {
                        await generateReactDemoStories(this.info.bind(this));
                    },
                } satisfies Plugin,
            ],
        });
    },
};
export default config;
