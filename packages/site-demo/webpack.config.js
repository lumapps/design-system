/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IS_CI = require('is-ci');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackNotifierPlugin = require('webpack-notifier');

const CONFIGS = require('../../configs');

const PKG_NAME = '@lumx/demo';
const PKG_PATH = path.resolve(__dirname, './');
const SRC_PATH = `${PKG_PATH}/src`;
const CONTENT_PATH = `${PKG_PATH}/content`;
const DIST_PATH = `${PKG_PATH}/dist`;

const mode = process.env.NODE_ENV || 'production';
const isProd = mode === 'production';
const isDev = !isProd;

const filename = '[name].[hash:8]';

const minimizer = [];

const plugins = [
    CONFIGS.ignoreNotFoundExport,
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),

    new MiniCssExtractPlugin({
        filename: `${filename}.css`,
    }),

    new HtmlWebpackPlugin({
        inject: false,
        template: `${SRC_PATH}/index.html.ejs`,
    }),

    new ForkTsCheckerWebpackPlugin(),
];

const cssLoaders = [
    {
        loader: 'css-loader',
    },
    {
        loader: 'postcss-loader',
        options: {
            config: {
                path: `${PKG_PATH}/postcss.config.js`,
            },
        },
    },
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
        /* Clean output. */
        new CleanWebpackPlugin(),

        new HtmlMinifierPlugin(CONFIGS.htmlMinifier),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: CONFIGS.cssNano,
        }),
    );
    cssLoaders.splice(0, 0, {
        loader: MiniCssExtractPlugin.loader,
    });
}

if (isDev) {
    cssLoaders.splice(0, 0, {
        loader: 'style-loader',
    });
}

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: 'Design System Website',
        }),
    );
}

const extensions = ['.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.json'];

module.exports = {
    bail: true,
    devtool: 'source-map',
    mode,
    name: PKG_NAME,
    externals: ['angular'],
    entry: {
        main: `${SRC_PATH}/index.tsx`,
        'theme-material': `${SRC_PATH}/style/material.scss`,
        'theme-lumapps': `${SRC_PATH}/style/lumapps.scss`,
    },

    resolve: {
        alias: {
            content: CONTENT_PATH,
        },
        extensions,
        plugins: [new TsconfigPathsPlugin({ extensions })],
    },

    resolveLoader: {
        alias: {
            'props-loader': path.resolve(__dirname, 'webpack-loader/props-loader'),
            'mdx-loader': path.resolve(__dirname, 'webpack-loader/mdx-loader'),
        },
    },

    module: {
        rules: [
            {
                test: /\.scss$/u,
                use: [
                    ...cssLoaders,
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.css$/u,
                use: cssLoaders,
            },
            {
                test: /content\/.*\.(png|jpe?g|gif|svg|sketch)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: CONTENT_PATH,
                },
            },
            {
                exclude: /content/,
                test: /\.(png|jpg|gif|woff(2)?|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name]-[hash:8].[ext]',
                    context: SRC_PATH,
                },
            },
            {
                exclude: [/node_modules/u, /\.(test|spec)\.[t|j]sx?/u],
                test: /\.[t|j]sx?$/u,
                use: {
                    loader: 'babel-loader',
                    options: CONFIGS.babel,
                },
            },
            {
                test: /\.mdx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: CONFIGS.babel,
                    },
                    {
                        loader: 'mdx-loader',
                    },
                ],
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
        ],
    },

    output: {
        filename: `${filename}.js`,
        path: DIST_PATH,
        publicPath: '/',
    },

    node: {
        fs: 'empty',
    },

    plugins,

    optimization: {
        minimize: isProd,
        minimizer,
        splitChunks: {
            cacheGroups: {
                vendors: false,
            },
        },
    },

    performance: {
        assetFilter: (file) => file.endsWith('.min.js'),
    },
};

if (isDev) {
    module.exports.devServer = {
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
            index: '/',
        },
        host: '0.0.0.0',
        hot: true,
        open: true,
        overlay: true,
        port: 4000,
        quiet: true,
    };

    module.exports.watch = true;
}
