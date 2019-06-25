const IS_CI = require('is-ci');

const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('../utils');
const { COMPONENTS_PATH, CONFIGS, CORE_PATH, DIST_PATH, EXAMPLES_PATH, ROOT_PATH } = require('../constants');

const angularJsConfig = require('./webpack.config');

const minify = Boolean(process.env.MINIFY);
const generatePackage = Boolean(process.env.GENERATE_PACKAGE);

const filename = `[name]${minify ? '.min' : ''}`;
const distTechPath = `${DIST_PATH}/angularjs`;

const minimizer = [];
const plugins = [
    ...angularJsConfig.plugins,
    new ExtractCssChunks({
        chunkFilename: `${filename}.css`,
        filename: `${filename}.css`,
    }),
];

if (!IS_CI) {
    plugins.push(
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            title: `LumX - AngularJS - ${minify ? 'Minified package' : 'Package'}`,
        }),
    );
}

if (generatePackage) {
    plugins.push(
        new CopyWebpackPlugin([
            {
                from: `${EXAMPLES_PATH}/angularjs/`,
                to: `${DIST_PATH}/angularjs/examples/`,
            },
            {
                from: `${EXAMPLES_PATH}/styles.css`,
                to: `${DIST_PATH}/angularjs/examples/`,
            },
            {
                from: `${ROOT_PATH}/CONTRIBUTING.md`,
                to: `${DIST_PATH}/angularjs/`,
            },
            {
                from: `${ROOT_PATH}/LICENSE.md`,
                to: `${DIST_PATH}/angularjs/`,
            },
            {
                from: `${CORE_PATH}/angularjs/README.md`,
                to: `${DIST_PATH}/angularjs/`,
            },
            {
                from: `${CORE_PATH}/angularjs/package.json`,
                to: `${DIST_PATH}/angularjs/`,
            },
            {
                context: `${CORE_PATH}/style/`,
                from: `${CORE_PATH}/style/*.scss`,
                to: `${DIST_PATH}/angularjs/scss`,
            },
            {
                context: `${CORE_PATH}/style/`,
                from: { glob: `${CORE_PATH}/style/**/*.scss`, ignore: [`${CORE_PATH}/style/*`] },
                to: `${DIST_PATH}/angularjs/scss/core`,
            },
            {
                context: `${COMPONENTS_PATH}/`,
                from: `${COMPONENTS_PATH}/**/style/**/*.scss`,
                to: `${DIST_PATH}/angularjs/scss/components`,
                transformPath: (targetPath) => targetPath.replace('/style/', '/'),
            },
        ]),
    );
    plugins.push(
        new ReplaceInFileWebpackPlugin([
            {
                dir: `${DIST_PATH}/angularjs/scss`,
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
    );
}

if (minify) {
    plugins.push(new HtmlMinifierPlugin(CONFIGS.htmlMinifier));
    plugins.push(
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: CONFIGS.cssNano,
            cssProcessorPluginOptions: {},
        }),
    );
    minimizer.push(
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            terserOptions: CONFIGS.terser,
        }),
    );
}

module.exports = merge.smartStrategy({
    entry: 'append',
    'module.rules': 'append',
    plugins: 'replace',
    output: 'replace',
})(angularJsConfig, {
    bail: true,
    devtool: minify ? 'source-map' : '',
    externals: {
        angularjs: {
            amd: 'angularjs',
            commonjs: 'angularjs',
            commonjs2: 'angularjs',
            root: 'AngularJS',
        },
        'angularjs-dom': {
            amd: 'angularjs-dom',
            commonjs: 'angularjs-dom',
            commonjs2: 'angularjs-dom',
            root: 'AngularJSDOM',
        },
    },
    mode: 'production',
    name: `angularjs-umd${minify ? '-minified' : ''}`,

    module: {
        rules: getStyleLoader({ mode: 'prod' }),
    },

    output: {
        ...angularJsConfig.output,
        chunkFilename: `${filename}.js`,
        filename: `${filename}.js`,
        library: {
            root: 'LumX',
            amd: '@lumx/angularjs',
            commonjs: '@lumx/angularjs',
        },
        libraryTarget: 'umd',
        path: distTechPath,
        sourceMapFilename: minify ? `${filename}.js.map` : undefined,
        umdNamedDefine: true,
    },

    plugins,

    optimization: {
        minimize: minify,
        minimizer,
    },
});
