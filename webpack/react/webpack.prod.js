const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsDeclarationWebpackPlugin = require('ts-declaration-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('../utils');
const { COMPONENTS_PATH, CONFIGS, CORE_PATH, DIST_PATH, EXAMPLES_PATH, ROOT_PATH } = require('../constants');

const reactConfig = require('./webpack.config');

const filename = '[name].min';
const distTechPath = `${DIST_PATH}/react`;

const minimizer = [
    new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: CONFIGS.terser,
    }),
];

const plugins = [
    ...reactConfig.plugins,

    /* Extract CSS files */
    new ExtractCssChunks({
        chunkFilename: `${filename}.css`,
        filename: `${filename}.css`,
    }),

    /* Bundle static files */
    new CopyWebpackPlugin([
        {
            from: `${EXAMPLES_PATH}/react/`,
            to: `${DIST_PATH}/react/examples/`,
        },
        {
            from: `${EXAMPLES_PATH}/styles.css`,
            to: `${DIST_PATH}/react/examples/`,
        },
        {
            from: `${ROOT_PATH}/CONTRIBUTING.md`,
            to: `${DIST_PATH}/react/`,
        },
        {
            from: `${ROOT_PATH}/LICENSE.md`,
            to: `${DIST_PATH}/react/`,
        },
        {
            from: `${CORE_PATH}/react/README.md`,
            to: `${DIST_PATH}/react/`,
        },
        {
            from: `${CORE_PATH}/react/package.json`,
            to: `${DIST_PATH}/react/`,
        },
        {
            context: `${CORE_PATH}/style/`,
            from: `${CORE_PATH}/style/*.scss`,
            to: `${DIST_PATH}/react/scss`,
        },
        {
            context: `${CORE_PATH}/style/`,
            from: { glob: `${CORE_PATH}/style/**/*.scss`, ignore: [`${CORE_PATH}/style/*`] },
            to: `${DIST_PATH}/react/scss/core`,
        },
        {
            context: `${COMPONENTS_PATH}/`,
            from: `${COMPONENTS_PATH}/**/style/**/*.scss`,
            to: `${DIST_PATH}/react/scss/components`,
            transformPath: (targetPath) => targetPath.replace('/style/', '/'),
        },
    ]),

    /* Fix SCSS paths */
    new ReplaceInFileWebpackPlugin([
        {
            dir: `${DIST_PATH}/react/scss`,
            rules: [
                {
                    search: /'\.\/(base|elevation|grid|input|link|size|spacing|state|theme|typography)/g,
                    replace: "'./core/$1",
                },
                {
                    search: /'\.\.\/\.\.\/components/g,
                    replace: "'./components",
                },
                {
                    search: /\/style/g,
                    replace: '',
                },
            ],
        },
    ]),

    /* Minimize HTML & CSS */
    new HtmlMinifierPlugin(CONFIGS.htmlMinifier),
    new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: CONFIGS.cssNano,
        cssProcessorPluginOptions: {},
    }),

    /* Bundle unminified JS */
    new UnminifiedWebpackPlugin(),

    /* Bundle TypeScript declaration file */
    new TsDeclarationWebpackPlugin({
        name: 'lumx.react.d.ts',
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: 'LumX - React - Package',
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
    output: 'replace',
})(reactConfig, {
    bail: true,
    devtool: 'source-map',
    externals: {
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
    mode: 'production',
    name: 'lumx-react-umd',

    module: {
        rules: getStyleLoader({ mode: 'prod' }),
    },

    output: {
        ...reactConfig.output,
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        library: {
            root: 'LumX',
            amd: '@lumx/react',
            commonjs: '@lumx/react',
        },
        libraryTarget: 'umd',
        path: distTechPath,
        sourceMapFilename: `${filename}.js.map`,
        umdNamedDefine: true,
    },

    plugins,

    optimization: {
        minimize: true,
        minimizer,
    },
});
