const IS_CI = require('is-ci');

const merge = require('webpack-merge');
const path = require('path');
const { babelSetup } = require('../utils');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { CORE_PATH, CONFIGS, SRC_PATH, DEMO_PATH, DIST_PATH, ICONS_PATH, NODE_MODULES_PATH } = require('../constants');

const mode = process.env.MODE || 'dev';
const isDev = mode === 'dev';
const isProd = mode === 'prod';
const reactConfig = require('./webpack.config');

const filename = '[name].[hash:8]';
const outputPath = `${DIST_PATH}/design.lumapps.com`;

const minimizer = [];

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
    ...reactConfig.plugins,

    new MiniCssExtractPlugin({
        filename: `${filename}.css`,
    }),

    new HtmlWebpackPlugin({
        inject: false,
        template: `${DEMO_PATH}/react/index.html.ejs`,
    }),
];

// Optimize/Minify CSS/HTML.
if (isProd) {
    minimizer.push(
        new TerserPlugin({
            cache: true,
            parallel: true,
            terserOptions: CONFIGS.terser,
        }),
    );
    plugins.push(
        new HtmlMinifierPlugin(CONFIGS.htmlMinifier),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: CONFIGS.cssNano,
        }),
    );
}

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: 'Design System Website',
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'replace',
    'module.rules': 'append',
    'resolve.alias': 'append',
    'resolve.extensions': 'append',
    plugins: 'replace',
    output: 'append',
    externals: 'replace',
})(reactConfig, {
    bail: true,
    devtool: isDev ? 'source-map' : '',
    mode: isProd ? 'production' : 'development',
    name: 'demo-site',
    externals: [],
    entry: {
        main: `${DEMO_PATH}/react/index.tsx`,
        'theme-material': `${DEMO_PATH}/style/material.scss`,
        'theme-lumapps': `${DEMO_PATH}/style/lumapps.scss`,
    },

    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            LumX: `${SRC_PATH}/react.index.ts`,
        },
        extensions: ['.md', '.mdx'],
    },

    resolveLoader: {
        alias: {
            'props-loader': path.resolve(__dirname, 'props-loader'),
            'mdx-loader': path.resolve(__dirname, 'mdx-loader'),
        },
    },

    module: {
        rules: [
            {
                test: /\.scss$/u,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hot: isDev,
                            reloadAll: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: `${CORE_PATH}/style/postcss.config.js`,
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                `${ICONS_PATH}/node_modules/@mdi/font/scss/`,
                                `${NODE_MODULES_PATH}/sass-mq`,
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.css$/u,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hot: isDev,
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: `${CORE_PATH}/style/postcss.config.js`,
                            },
                        },
                    },
                ],
            },
            {
                test: /demo\/react\/doc\/.*\.(png|jpe?g|gif|svg|sketch)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'demo/react/doc',
                },
            },
            {
                test: /\.mdx?$/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelSetup({
                            presets: ['@babel/preset-react'],
                        }),
                    },
                    {
                        loader: 'mdx-loader',
                    },
                ],
            },
        ],
    },

    output: {
        filename: `${filename}.js`,
        path: outputPath,
        publicPath: '/',
    },

    plugins,

    optimization: {
        minimize: isProd,
        minimizer,
    },
});

if (isDev) {
    const DEFAULT_HOST = '0.0.0.0';
    const DEFAULT_PORT = 4000;

    module.exports.devServer = {
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
        port: DEFAULT_PORT,
        quiet: true,
    };
}
