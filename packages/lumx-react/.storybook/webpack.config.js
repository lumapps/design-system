const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const CONFIGS = require('../../../configs');
const POSTCSS_CONFIG = path.resolve(__dirname, 'postcss.config.js');

module.exports = async ({ config }) => {
    config.module.rules.push(
        /** SCSS Loader */
        {
            test: /\.scss$/,
            sideEffects: true,
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

        /** TS/TSX/JS/JSX babel loader. */
        {
            exclude: [/node_modules/u, /\.(test|spec)\.[t|j]sx?/u],
            test: /\.[j|t]sx?$/u,
            use: {
                loader: 'babel-loader',
                options: CONFIGS.babel,
            },
        },
    );

    /** Resolve file extensions. */
    config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx', '.js', '.jsx'];

    /** Resolve module aliases @lumx/XXX */
    config.resolve.plugins = [new TsconfigPathsPlugin()];

    return config;
};
