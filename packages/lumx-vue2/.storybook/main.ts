import type { StorybookConfig } from '@storybook/vue-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx'
import path from 'path';

const classNameToClass = function ({ types: t }) {
  return {
    visitor: {
      JSXAttribute(path) {
        if (path.node.name.name === 'className') {
          path.node.name.name = 'class';
        }
      },
    },
  };
};

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    framework: '@storybook/vue-vite',
    docs: {
        autodocs: false,
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            optimizeDeps: { include: ['@lumx/icons'] },
            resolve: {
                alias: {
                    '@vue/babel-helper-vue-jsx-merge-props': path.resolve(__dirname, '..', 'node_modules/@vue/babel-helper-vue-jsx-merge-props'),
                },
            },
            plugins: [vue(), tsconfigPaths(), vueJsx({
                babelPlugins: [classNameToClass],
            })],
        });
    },
};
export default config;
