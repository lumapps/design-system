import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import postcss from './postcss.config';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@chromatic-com/storybook',
    ],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],

    async viteFinal(config) {
        return mergeConfig(config, {
            css: { postcss },
        });
    },
};
export default config;
