const fs = require('fs');
const glob = require('glob');
const readPkg = require('read-pkg');

const has = require('lodash/has');

const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { shouldPrintComment } = require('babel-plugin-smart-webpack-import');

const {
    APP_PATH,
    COMPONENTS_PATH,
    CONFIGS,
    DEFAULT_HOST,
    DEFAULT_PORT,
    DIST_PATH,
    EXAMPLES_PATH,
    ROOT_PATH,
    TECH_DESCRIPTIONS,
    TECH_KEYWORDS,
    TECH_PREFIX,
} = require('./constants');

/**
 * Setup Babel transpiler.
 *
 * @param  {Array}  [plugins] The plugins to use.
 * @param  {Array}  [presets] The presets to use.
 * @param  {Object} [options] The options to use.
 * @return {Object} The Babel configuration object.
 */
function babelSetup({ plugins = [], presets = [], options = {} } = {}) {
    return {
        ...options,
        plugins: [
            ...plugins,
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining',
        ],
        presets: [
            ...presets,
            [
                '@babel/preset-env',
                {
                    loose: true,
                    targets: ['last 2 versions', 'ie >= 11'],
                    useBuiltIns: 'usage',
                },
            ],
        ],
        shouldPrintComment,
    };
}

/**
 * Returns all entry point for a given technology and prefix.
 *
 * @param  {string} prefix    The tech name (react|angularjs) to match correct path.
 * @param  {string} extension The file extension to match.
 * @return {Object} An object of all formatted matches to use in webpack config entry option with filename
 *                  as key and path as value.
 */
function getComponents({ prefix, extension }) {
    const files = {};
    const matches = glob.sync(`${COMPONENTS_PATH}/**/${prefix}/**/*.${extension}`);
    const fileNameRegexp = `(?:.*)/(.*).${extension}`;

    matches.forEach((match) => {
        files[match.match(fileNameRegexp)[1]] = match;
    });

    return files;
}

/**
 * Get the content of the package.json file for the production bundle of the given tech.
 *
 * @param  {string} tech The tech we want the package.json of.
 * .                    Possible values are: 'angularjs' or 'react'.
 * @return {string} The content of the package.json file of the given tech.
 */
function getPackageJson({ tech }) {
    if (!has(TECH_PREFIX, tech)) {
        throw new Error(`Unknown tech "${tech}" for generating package.json file`);
    }

    const { author, bugs, contributors, engines, homepage, license, repository, version } = readPkg.sync(ROOT_PATH);

    const packageJson = {
        author,
        bugs,
        contributors,
        description: has(TECH_DESCRIPTIONS, tech) ? TECH_DESCRIPTIONS[tech] : TECH_DESCRIPTIONS.default,
        devDependencies: { 'http-server': 'latest' },
        engines,
        homepage,
        keywords: TECH_KEYWORDS.default.concat(has(TECH_KEYWORDS, tech) ? TECH_KEYWORDS[tech] : []),
        license,
        name: `@lumx/${tech}`,
        private: false,
        repository,
        scripts: {
            serve: `http-server -p ${tech === 'react' ? '8081' : '8080'} ./ -s -o --cors -c-1`,
            setup: 'yarn install',
        },
        version,
    };

    // eslint-disable-next-line no-magic-numbers
    return JSON.stringify(packageJson, null, 4);
}

/**
 * Get the content of the README.md file for the production bundle of the given tech.
 *
 * @param  {string} tech The tech we want the README.md of.
 * .                    Possible values are: 'angularjs' or 'react'.
 * @return {string} The content of the README.md file of the given tech.
 */
function getReadme({ tech }) {
    if (!has(TECH_PREFIX, tech)) {
        throw new Error(`Unknown tech "${tech}" for generating README.md file`);
    }

    // eslint-disable-next-line no-sync
    let readme = fs.readFileSync(`${ROOT_PATH}/README.md`, 'utf8');

    const projectInstallationIndex = readme.indexOf('## Project installation');
    const startOfReadme = readme.substring(0, projectInstallationIndex);

    const examplesIndex = readme.indexOf('## How to run examples');
    const endOfReadme = readme.substring(examplesIndex);

    readme = `${startOfReadme}${endOfReadme}`;

    if (tech === 'angularjs') {
        readme = readme.replace(' or [ReactJS][reactjs]', '');
        readme = readme.replace(/@lumx\/<angularjs\|react>/g, '@lumx/angularjs');
        readme = readme.replace(' or [ReactJS][reactjs-release]', '');
        readme = readme.replace(
            ' for AngularJS example or [http://localhost:8081](http://localhost:8081) for ReactJS example',
            '',
        );
    } else if (tech === 'react') {
        readme = readme.replace('[AngularJS][angularjs] or ', '');
        readme = readme.replace(/@lumx\/<angularjs\|react>/g, '@lumx/react');
        readme = readme.replace('[AngularJS][angularjs-release] or ', '');
        readme = readme.replace('[http://localhost:8080](http://localhost:8080) for AngularJS example or ', '');
        readme = readme.replace(' for ReactJS example', '');
    }

    readme = readme.replace(
        'LumX\'s documentation is included in the "demo" directory. The demo/documentation site is built with [Webpack][webpack] and may be run locally.',
        '',
    );
    readme = readme.replace('You can also find', 'You can find');
    readme = readme.replace('(./dist/<angularjs|react>/examples)', '(./examples)');
    readme = readme.replace('In the `dist/<angularjs|react>` directory,', 'Simply');
    // eslint-disable-next-line no-useless-assign/no-useless-assign
    readme = readme.replace(/[:/]?<angularjs\|react>/g, '');

    return readme;
}

/**
 * Returns `WebpackDevServer` default config to use in dev mode.
 *
 * @param  {number} port The port we want to use.
 * @return {Object} The config object.
 */
function getWebpackDevServerConfig({ port } = {}) {
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
        port: port || DEFAULT_PORT,
        quiet: true,
    };
}

/**
 * Build the production configuration for the given tech in the given module type.
 *
 * @param  {Object} config         The configuration to use as the base configuration.
 * @param  {string} tech           The tech we want to build the package of.
 * .                               Possible values are: 'angularjs' or 'react'.
 * @param  {string} moduleType     The type of module we want to use for the build.
 *                                 Allowed values are the same as the Webpack `output.libraryTarget` ones (e.g. 'umd',
 *                                 'amd', 'commonjs', ...).
 *                                 See: https://webpack.js.org/guides/author-libraries/.
 * @param  {boolean} [minify=true] Indicates if you want to minify the bundle.
 * @return {Object} The built configuration for the production build.
 */
function buildConfig({ config, tech, moduleType, minify = true }) {
    if (!has(TECH_PREFIX, tech)) {
        throw new Error(`Unknown tech "${tech}"`);
    }

    const filename = `[name]${minify ? '.min' : ''}`;
    const distTechPath = `${DIST_PATH}/${tech}`;

    const minimizer = [];

    const plugins = [
        ...config.plugins,
        new ExtractCssChunks({
            chunkFilename: `${filename}.css`,
            filename: `${filename}.css`,
        }),
        new CopyWebpackPlugin([
            {
                from: `${EXAMPLES_PATH}/${tech}`,
                to: `${distTechPath}/examples/`,
            },
            {
                from: `${EXAMPLES_PATH}/styles.css`,
                to: `${distTechPath}/examples/`,
            },
            {
                from: `${ROOT_PATH}/CONTRIBUTING.md`,
                to: `${distTechPath}/`,
            },
            {
                from: `${ROOT_PATH}/LICENSE.md`,
                to: `${distTechPath}/`,
            },
        ]),
        new CreateFileWebpack({
            content: getPackageJson({ tech }),
            fileName: 'package.json',
            path: distTechPath,
        }),
        new CreateFileWebpack({
            content: getReadme({ tech }),
            fileName: 'README.md',
            path: distTechPath,
        }),
    ];
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

    return merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
        output: 'replace',
    })(config, {
        bail: true,

        devtool: 'source-map',
        mode: 'production',

        name: `${tech}-${moduleType}${minify ? '-minified' : ''}`,

        output: {
            ...config.output,
            chunkFilename: `${filename}.js`,
            filename: `${filename}.js`,
            library: {
                root: 'LumX',
                amd: `@lumx/${tech}`,
                commonjs: `@lumx/${tech}`,
            },
            libraryTarget: moduleType,
            path: distTechPath,
            sourceMapFilename: `${filename}.js.map`,
            umdNamedDefine: moduleType === 'umd' ? true : undefined,
        },

        plugins,

        optimization: {
            minimize: minify,
            minimizer,
        },
    });
}

module.exports = {
    babelSetup,
    buildConfig,
    getComponents,
    getWebpackDevServerConfig,
};
