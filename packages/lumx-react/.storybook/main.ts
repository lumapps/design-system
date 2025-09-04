import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import generateDemoStories from './generate-demo-stories';
import postcss from './postcss.config';

// Generate storybook stories from demo site demos.
generateDemoStories();

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],

    async viteFinal(config) {
        return mergeConfig(config, {
            plugins: [tsconfigPaths()],
            css: { postcss },
        });
    }
};
export default config;
