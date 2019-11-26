const baseWebpackConfig = require('../webpack.config');

module.exports = async ({ config, mode }) => {
    /** SCSS Loader */
    config.module.rules.push({
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
    });

    config.module.rules = [...config.module.rules, ...baseWebpackConfig.module.rules];
    config.resolve.extensions = [...config.resolve.extensions, ...baseWebpackConfig.resolve.extensions];
    config.resolve.alias = { ...config.resolve.alias, ...baseWebpackConfig.resolve.alias };

    return config;
};
