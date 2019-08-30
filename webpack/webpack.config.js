const IS_CI = require('is-ci');
const path = require('path');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const { babelSetup } = require('./utils');
const { COMPONENTS_PATH, CORE_PATH, DEMO_PATH, ICONS_PATH } = require('./constants');

const plugins = [new WebpackBar(), new FriendlyErrorsWebpackPlugin()];

const baseConfig = {
    cache: true,

    devtool: 'cheap-module-source-map',

    entry: {
        'lumx-theme-lumapps': `${CORE_PATH}/style/lumx-theme-lumapps.scss`,
        'lumx-theme-material': `${CORE_PATH}/style/lumx-theme-material.scss`,
    },

    externals: [
        '@uirouter/angularjs',
        'angularjs',
        {
            jquery: {
                commonjs: 'jquery',
                amd: 'jquery',
                root: '$',
            },
            react: 'React',
            'react-dom': 'ReactDOM',
        },
    ],

    mode: 'development',

    module: {
        rules: [
            {
                exclude: [/node_modules/u, /\.(test|spec)\.js/u, /testing/u],
                test: /\.js$/u,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelSetup({ plugins: [['angularjs-annotate', { explicitOnly: true }]] }),
                    },
                ],
            },
            {
                exclude: [/node_modules/u, /\.(test|spec)\.jsx/u, /testing/u],
                test: /\.jsx$/u,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelSetup({
                            presets: ['@babel/preset-react'],
                        }),
                    },
                ],
            },
            {
                exclude: [/node_modules/u, /\.(test|spec)\.tsx?/u, /testing/u],
                test: /\.tsx?$/u,
                loader: 'awesome-typescript-loader',
                options: {
                    reportFiles: ['**/*.(!test|spec).(ts|tsx)'],
                    silent: true,
                    useCache: true,
                },
            },
            {
                test: /\.(png|jpg|gif|woff(2)?|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name]-[hash:8].[ext]',
                },
            },
        ],
    },

    node: {
        fs: 'empty',
    },

    output: {
        chunkFilename: '[name].js',
        crossOriginLoading: 'anonymous',
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
    },

    performance: {
        hints: false,
    },

    plugins,

    profile: false,

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', 'json', '.md', '.mdx'],
        modules: ['node_modules'],
        alias: {
            'LumX/angularjs': path.resolve(__dirname, `${CORE_PATH}/angularjs`),
            'LumX/components': path.resolve(__dirname, COMPONENTS_PATH),
            'LumX/core': path.resolve(__dirname, CORE_PATH),
            'LumX/demo': path.resolve(__dirname, DEMO_PATH),
            'LumX/icons': path.resolve(__dirname, `${ICONS_PATH}/index.js`),
            'LumX/react': path.resolve(__dirname, `${CORE_PATH}/react`),
        },
    },

    stats: {
        builtAt: true,
        colors: !IS_CI,
        errorDetails: true,
        errors: true,
        performance: true,
        timings: true,
        warnings: true,

        assets: false,
        cached: false,
        cachedAssets: false,
        children: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        chunks: false,
        depth: false,
        entrypoints: false,
        env: false,
        hash: false,
        moduleTrace: false,
        modules: false,
        providedExports: false,
        publicPath: false,
        reasons: false,
        source: false,
        usedExports: false,
        version: false,
    },

    target: 'web',
};

module.exports = baseConfig;
