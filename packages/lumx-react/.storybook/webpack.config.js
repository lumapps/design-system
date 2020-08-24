const path = require('path');
const baseWebpackConfig = require('../webpack.config');
const CONFIGS = require('../../../configs');

const POSTCSS_CONFIG = path.resolve(__dirname, 'postcss.config.js');

module.exports = async ({ config, mode }) => {
    /** SCSS Loader */
    config.module.rules.push({
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
    });

    config.plugins = [CONFIGS.ignoreNotFoundExport, ...config.plugins];
    config.module.rules = [...config.module.rules, ...baseWebpackConfig.module.rules];
    config.resolve.extensions = [...config.resolve.extensions, ...baseWebpackConfig.resolve.extensions];
    config.resolve.plugins = baseWebpackConfig.resolve.plugins;

    return config;
};
