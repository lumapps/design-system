const has = require('lodash/has');

const merge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getStyleLoader } = require('./utils');
const { APP_PATH, DEFAULT_HOST, DEFAULT_PORT, DEMO_PATH, TECH_PREFIX } = require('./constants');

/**
 * Returns `WebpackDevServer` default config to use in dev mode.
 *
 * @param  {number} [port=<DEFAULT_PORT=4000>] The port we want to use.
 * @return {Object} The config object.
 */
function getWebpackDevServerConfig({ port = DEFAULT_PORT }) {
    return {
        compress: true,
        contentBase: APP_PATH,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
            index: '/',
        },
        host: DEFAULT_HOST,
        hot: true,
        open: true,
        overlay: true,
        port,
        quiet: true,
    };
}

/**
 * Build the development configuration for the given tech.
 *
 * @param  {Object} config      The configuration to use as the base configuration.
 * @param  {string} tech        The tech we want to build the package of.
 * .                            Possible values are: 'angularjs' or 'react'.
 * @param  {number} [port] The port of the development server.
 * @return {Object} The built configuration for the production build.
 */
function getDevConfig({ config, tech, devServerPort: port }) {
    if (!has(TECH_PREFIX, tech)) {
        throw new Error(`Unknown tech "${tech}"`);
    }

    return merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
        output: 'replace',
    })(config, {
        devServer: getWebpackDevServerConfig({ port }),
        entry: {
            'demo-theme-lumapps': `${DEMO_PATH}/style/lumapps.js`,
            'demo-theme-material': `${DEMO_PATH}/style/material.js`,
        },
        module: {
            rules: [getStyleLoader({ mode: 'dev' })],
        },
        plugins: [
            ...config.plugins,
            new ExtractCssChunks({
                chunkFilename: '[name].css',
                filename: '[name].css',
            }),
            new HtmlWebpackPlugin({
                inject: false,
                template: `${DEMO_PATH}/${tech}/index.html`,
            }),
        ],
    });
}

module.exports = {
    getDevConfig,
};
