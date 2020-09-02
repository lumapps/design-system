/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable import/no-extraneous-dependencies */

const IS_CI = require('is-ci');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackNotifierPlugin = require('webpack-notifier');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { argv } = require('yargs');

const CONFIGS = require('../../configs');

const PKG_NAME = '@lumx/react';
const PKG_PATH = path.resolve(__dirname, './');
const SRC_PATH = `${PKG_PATH}/src`;
const DIST_PATH = `${PKG_PATH}/dist`;

const filename = '[name].min';

const minimizer = [
    new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: CONFIGS.terser,
    }),
];

const plugins = [
    CONFIGS.ignoreNotFoundExport,
    /* Clean output. */
    new CleanWebpackPlugin(),

    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
    new CopyWebpackPlugin([
        {
            from: `${CONFIGS.path.ROOT_PATH}/CONTRIBUTING.md`,
            to: DIST_PATH,
        },
        {
            from: `${CONFIGS.path.ROOT_PATH}/LICENSE.md`,
            to: DIST_PATH,
        },
        {
            from: `${PKG_PATH}/README.md`,
            to: DIST_PATH,
        },
        {
            from: `${PKG_PATH}/package.json`,
            to: DIST_PATH,
        },
        {
            from: SRC_PATH,
            ignore: ['*.snap'],
            to: `${DIST_PATH}/src/`,
        },
    ]),

    /* Bundle non-minified versions of js/css files. */
    new UnminifiedWebpackPlugin(),

    new ForkTsCheckerWebpackPlugin({
        reportFiles: ['!*.test.ts', '!*.test.tsx', '!*.stories.tsx'],
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: `LumX - ${PKG_NAME} Package`,
        }),
    );
}

if (argv && argv.analyze) {
    plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'gzip',
            generateStatsFile: true,
            logLevel: 'silent',
            openAnalyzer: false,
        }),
    );
}

module.exports = {
    entry: {
        'lumx.react': `${SRC_PATH}/index.ts`,
    },

    externals: [
        'moment',
        'moment-range',
        {
            react: {
                amd: 'react',
                commonjs: 'react',
                commonjs2: 'react',
                root: 'React',
            },
            'react-dom': {
                amd: 'react-dom',
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                root: 'ReactDOM',
            },
        },
    ],

    bail: true,
    devtool: 'source-map',
    mode: 'production',
    name: PKG_NAME,

    module: {
        rules: [
            {
                exclude: [/node_modules/u, /\.(test|spec)\.[t|j]sx?/u],
                test: /\.[j|t]sx?$/u,
                use: {
                    loader: 'babel-loader',
                    options: CONFIGS.babel,
                },
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        plugins: [new TsconfigPathsPlugin()],
    },

    output: {
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        path: DIST_PATH,
        library: {
            root: 'LumX',
            amd: PKG_NAME,
            commonjs: PKG_NAME,
        },
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },

    plugins,

    optimization: {
        minimize: true,
        minimizer,
    },

    stats: {
        colors: !IS_CI,
    },

    performance: {
        assetFilter: (file) => file.endsWith('.min.js'),
    },
};
