import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue';
import postcss from './postcss.config';

const config: StorybookConfig = {
    framework: '@storybook/vue3-vite',
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@chromatic-com/storybook',
    ],
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],

    async viteFinal(config) {
        return mergeConfig(config, {
            optimizeDeps: { include: ['@lumx/icons'] },
            plugins: [
                vue({
                    template: {
                        compilerOptions: {
                            isCustomElement: (tag) => tag.startsWith('lumx-'),
                        },
                    },
                }),
                tsconfigPaths(),
            ],
            css: { postcss },
        });
    },
};
export default config;
