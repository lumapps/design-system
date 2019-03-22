const IS_CI = require('is-ci');

const fs = require('fs');
const readPkg = require('read-pkg');

const has = require('lodash/has');

const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CreateFileWebpack = require('create-file-webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const { getStyleLoader } = require('./utils');
const {
    COMPONENTS_PATH,
    CONFIGS,
    CORE_PATH,
    DIST_PATH,
    EXAMPLES_PATH,
    ROOT_PATH,
    TECH_DESCRIPTIONS,
    TECH_KEYWORDS,
    TECH_NAMES,
    TECH_PREFIX,
} = require('./constants');

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

    if (tech === TECH_PREFIX.angularjs) {
        readme = readme.replace(` or [${TECH_NAMES.react}][${TECH_PREFIX.react}]`, '');
        readme = readme.replace(/@lumx\/<angularjs\|react>/g, `@lumx/${TECH_PREFIX.angularjs}`);
        readme = readme.replace(` or [${TECH_NAMES.react}][${TECH_PREFIX.react}-release]`, '');
        readme = readme.replace(
            ` for ${TECH_NAMES.angularjs} example or [http://localhost:8081](http://localhost:8081) for ${
                TECH_NAMES.react
            } example`,
            '',
        );
    } else if (tech === TECH_PREFIX.react) {
        readme = readme.replace(`[${TECH_NAMES.angularjs}][${TECH_PREFIX.angularjs}] or `, '');
        readme = readme.replace(/@lumx\/<angularjs\|react>/g, `@lumx/${TECH_PREFIX.react}`);
        readme = readme.replace(`[${TECH_NAMES.angularjs}][${TECH_PREFIX.angularjs}-release] or `, '');
        readme = readme.replace(
            `[http://localhost:8080](http://localhost:8080) for ${TECH_NAMES.angularjs} example or `,
            '',
        );
        readme = readme.replace(` for ${TECH_NAMES.react} example`, '');
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
 * Build the production configuration for the given tech in the given module type.
 *
 * @param  {Object} config         The configuration to use as the base configuration.
 * @param  {string} tech           The tech we want to build the package of.
 * .                               Possible values are: 'angularjs' or 'react'.
 * @param  {string} moduleType     The type of module we want to use for the build.
 *                                 Allowed values are the same as the Webpack `output.libraryTarget` ones (e.g. 'umd',
 *                                 'amd', 'commonjs', ...).
 *                                 See: https://webpack.js.org/guides/author-libraries/.
 * @return {Object} The built configuration for the production build.
 */
function getBuildConfig({ config, tech, moduleType }) {
    if (!has(TECH_PREFIX, tech)) {
        throw new Error(`Unknown tech "${tech}"`);
    }

    const minify = Boolean(process.env.MINIFY);
    const generatePackage = Boolean(process.env.GENERATE_PACKAGE);

    const filename = `[name]${minify ? '.min' : ''}`;
    const distTechPath = `${DIST_PATH}/${tech}`;

    const minimizer = [];
    const plugins = [
        ...config.plugins,
        new ExtractCssChunks({
            chunkFilename: `${filename}.css`,
            filename: `${filename}.css`,
        }),
    ];

    if (!IS_CI) {
        plugins.push(
            new WebpackNotifierPlugin({
                alwaysNotify: true,
                title: `LumX - ${TECH_NAMES[tech]} - ${minify ? 'Minified package' : 'Package'}`,
            }),
        );
    }

    if (generatePackage) {
        plugins.push(
            new CopyWebpackPlugin([
                {
                    from: `${EXAMPLES_PATH}/${tech}/`,
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
                {
                    from: `${CORE_PATH}/style/`,
                    to: `${distTechPath}/scss/core`,
                },
                {
                    context: `${COMPONENTS_PATH}`,
                    from: `${COMPONENTS_PATH}/**/style/**/*`,
                    to: `${distTechPath}/scss/components`,
                    transformPath: (targetPath) => targetPath.replace('/style/', '/'),
                },
            ]),
        );
        plugins.push(
            new CreateFileWebpack({
                content: getPackageJson({ tech }),
                fileName: 'package.json',
                path: distTechPath,
            }),
        );
        plugins.push(
            new CreateFileWebpack({
                content: getReadme({ tech }),
                fileName: 'README.md',
                path: distTechPath,
            }),
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

    return merge.smartStrategy({
        entry: 'append',
        'module.rules': 'append',
        plugins: 'replace',
        output: 'replace',
    })(config, {
        bail: true,
        devtool: minify ? 'source-map' : '',
        mode: 'production',
        name: `${tech}-${moduleType}${minify ? '-minified' : ''}`,

        module: {
            rules: [getStyleLoader({ mode: 'prod' })],
        },

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
            sourceMapFilename: minify ? `${filename}.js.map` : undefined,
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
    getBuildConfig,
};
