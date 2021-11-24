const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const CONFIGS = require('../../../configs');
const POSTCSS_CONFIG = require(path.resolve(__dirname, 'postcss.config.js'));
const generateDemoStories = require('./generate-demo-stories');

// Generate storybook stories from demo site demos.
generateDemoStories();

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../../site-demo/static/'],
    addons: [
        '@storybook/addon-knobs',
        '@storybook/addon-a11y',
        '@storybook/addon-essentials',
    ],
    webpackFinal: async (config) => {
        config.resolve.modules.push(
            path.resolve(__dirname, 'node_modules')
        );

        config.module.rules.push(
            /** SCSS Loader */
            {
                test: /\.s?css$/,
                sideEffects: true,
                loaders: [
                    { loader: 'style-loader', options: { attributes: { id: 'injected-styles' } } },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: POSTCSS_CONFIG,
                        },
                    },
                    'sass-loader',
                ],
            },

            /** TS/TSX/JS/JSX babel loader. */
            {
                exclude: [/node_modules/u, /\.(test|spec)\.[t|j]sx?/u],
                test: /\.[j|t]sx?$/u,
                use: {
                    loader: 'babel-loader',
                    options: CONFIGS.babel,
                },
            },

            /** File loader */
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: 'file-loader',
            },
        );

        /** Resolve file extensions. */
        config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx', '.js', '.jsx'];

        /** Resolve module aliases @lumx/XXX */
        config.resolve.plugins = [new TsconfigPathsPlugin({ configFile: '../tsconfig.json' })];

        return config;
    },
};
