const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IS_CI = require('is-ci');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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
    /* Clean output. */
    new CleanWebpackPlugin(),

    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),

    new MiniCssExtractPlugin({
        filename: `${filename}.css`,
    }),

    new HtmlWebpackPlugin({
        inject: false,
        template: `${SRC_PATH}/index.html.ejs`,
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

module.exports = {
    bail: true,
    devtool: isDev ? 'source-map' : '',
    mode,
    name: PKG_NAME,
    externals: [],
    entry: {
        main: `${SRC_PATH}/index.tsx`,
        'theme-material': `${SRC_PATH}/style/material.scss`,
        'theme-lumapps': `${SRC_PATH}/style/lumapps.scss`,
    },

    resolve: {
        alias: {
            [PKG_NAME]: SRC_PATH,
            content: CONTENT_PATH,
            '@lumx/core': '@lumx/core/src',
            '@lumx/react': '@lumx/react/src',
            '@lumx/angularjs': '@lumx/angularjs/src',
        },
        extensions: ['.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.json'],
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
                                path: `${PKG_PATH}/postcss.config.js`,
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
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
                                path: `${PKG_PATH}/postcss.config.js`,
                            },
                        },
                    },
                ],
            },
            {
                test: /content\/.*\.(png|jpe?g|gif|svg|sketch)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'content',
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
                exclude: [/node_modules/u, /\.(test|spec)\.jsx?/u],
                test: /\.jsx?$/u,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: {
                            ...CONFIGS.babel,
                            presets: ['@babel/preset-react', ...CONFIGS.babel.presets],
                        },
                    },
                ],
            },
            {
                exclude: [/node_modules/u, /\.(test|spec)\.tsx?/u],
                test: /\.tsx?$/u,
                loader: 'awesome-typescript-loader',
                options: {
                    reportFiles: ['**/*.(!test|spec).(ts|tsx)'],
                    useCache: true,
                },
            },
            {
                test: /\.mdx?$/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: {
                            ...CONFIGS.babel,
                            presets: ['@babel/preset-react', ...CONFIGS.babel.presets],
                        },
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

    plugins,

    optimization: {
        minimize: isProd,
        minimizer,
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
