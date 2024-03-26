import type { StorybookConfig } from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

import generateDemoStories from './generate-demo-stories';
import postcssOptions from './postcss.config';

// Generate storybook stories from demo site demos.
generateDemoStories();

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-webpack5-compiler-swc',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
        '@storybook/addon-interactions',
    ],
    staticDirs: ['../../site-demo/static/'],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: async (config) => {
        if (config.module?.rules) {
            /** S?CSS Loader */
            config.module.rules.push({
                  test: /\.s?css$/,
                  sideEffects: true,
                  use: [
                      'style-loader',
                      'css-loader',
                      { loader: 'postcss-loader', options: { postcssOptions } },
                      'sass-loader',
                  ],
            });
        }
        if (config.resolve) {
            config.resolve.plugins = [
                ...(config.resolve.plugins || []),
                new TsconfigPathsPlugin({
                    extensions: config.resolve.extensions,
                }),
            ];
        }
        return config;
    },
};
export default config;
