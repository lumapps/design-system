import type { StorybookConfig } from '@storybook/vue3-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx'

import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

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
        const vueDocgenIndex = config.plugins.findIndex(({ name }) => name === 'storybook:vue-docgen-plugin')
        if (vueDocgenIndex !== -1) config.plugins.splice(vueDocgenIndex, 1)
        return mergeConfig(config, {
            optimizeDeps: { include: ['@lumx/icons'] },
            css: { postcss },
            plugins: [vue(), vueJsx({
                // 1. Tell the Vue JSX compiler what function to use (h)
                // 2. Tell it to import 'h' from the 'vue' module
                // The default setup in modern Vue JSX handles this, but explicitly
                // ensuring the right runtime is used is key.
                babelPlugins: [
                    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'vue' }]
                ]
            }), tsconfigPaths()]
        });
    },
};
export default config;
