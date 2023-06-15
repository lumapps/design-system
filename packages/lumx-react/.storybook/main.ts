import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import generateDemoStories from './generate-demo-stories';
import postcss from './postcss.config';

// Generate storybook stories from demo site demos.
//generateDemoStories();

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-a11y', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    staticDirs: ['../../site-demo/static/'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            plugins: [tsconfigPaths()],
            css: { postcss },
        });
    },
};
export default config;
