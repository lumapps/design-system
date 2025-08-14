const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

const CONFIGS = require('../../configs');

const PKG_NAME = '@lumx/angularjs';
const PKG_PATH = path.resolve(__dirname, './');
const SRC_PATH = `${PKG_PATH}/src`;
const DIST_PATH = `${PKG_PATH}/dist`;

const filename = '[name].min';

module.exports = {
    entry: {
        'lumx.angularjs': `${SRC_PATH}/index.js`,
    },

    externals: [
        'angularjs',
        {
            jquery: {
                commonjs: 'jquery',
                amd: 'jquery',
                root: '$',
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
                exclude: /node_modules/u,
                test: /\.[j|t]sx?$/u,
                use: {
                    loader: 'babel-loader',
                    options: CONFIGS.babel,
                },
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
    },

    output: {
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        path: DIST_PATH,
        library: {
            name: {
                root: 'LumX',
                amd: PKG_NAME,
                commonjs: PKG_NAME,
            },
            type: 'umd',
            umdNamedDefine: true,
        },
    },

    plugins: [
        new CleanWebpackPlugin(),
        new UnminifiedWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
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
            ],
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },

    performance: {
        assetFilter: (file) => file.endsWith('.min.js'),
    },
};
