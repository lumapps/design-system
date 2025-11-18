import type { StorybookConfig } from '@storybook/vue3-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx'

import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  framework: '@storybook/vue3-vite',
  docs: {autodocs: false},
  async viteFinal(config) {
    return mergeConfig(config, {
                  optimizeDeps: { include: ['@lumx/icons'] },
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