const path = require('path');
const angularWebPackConfig = require('../webpack.config');
const POSTCSS_CONFIG = path.resolve(__dirname, '..', 'configs', 'postcss.config.js');

module.exports = {
    stories: ['../src/**/*.stories.js'],
    addons: [
        '@storybook/addon-knobs/register',
        '@storybook/addon-viewport/register',
        '@storybook/addon-a11y/register',
        '@storybook/addon-actions/register',
    ],
    webpackFinal: async (config) => {
        config.resolve.extensions = [...config.resolve.extensions, ...angularWebPackConfig.resolve.extensions];
        config.resolve.plugins = [...angularWebPackConfig.resolve.plugins];
        config.resolve.alias['angular'] = require.resolve("angular");

        config.module.rules.push(
            /** SCSS Loader */
            {
                test: /\.scss$/,
                loaders: [
                    { loader: 'style-loader', options: { attributes: { id: 'injected-styles' } } },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: POSTCSS_CONFIG,
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            /** AngularJS Loaders */
            ...angularWebPackConfig.module.rules,
        );

        /*console.dir(config, { depth: null });
        process.exit(0);*/

        return config;
    },
};
