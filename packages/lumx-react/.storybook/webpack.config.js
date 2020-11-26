const path = require('path');
const baseWebpackConfig = require('../webpack.config');
const CONFIGS = require('../../../configs');

const POSTCSS_CONFIG = path.resolve(__dirname, 'postcss.config.js');

module.exports = async ({ config, mode }) => {
    /** SCSS Loader */
    config.module.rules.push({
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
    });

    /** Ignore typescript type export warning. */
    config.plugins = [CONFIGS.ignoreNotFoundExport, ...config.plugins];

    /** TS/TSX/JS/JSX babel loader. */
    config.module.rules = [...config.module.rules, ...baseWebpackConfig.module.rules];

    /** Resolve file extensions. */
    config.resolve.extensions = [...config.resolve.extensions, ...baseWebpackConfig.resolve.extensions];

    /** Resolve module aliases @lumx/XXX */
    config.resolve.plugins = baseWebpackConfig.resolve.plugins;

    return config;
};
