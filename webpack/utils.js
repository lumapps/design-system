const glob = require('glob');

const { APP_PATH, CORE_PATH, COMPONENTS_PATH, DEFAULT_HOST, DEFAULT_PORT } = require('./constants');

/**
 * Setup Babel transpiler.
 *
 * @param  {Array}  [plugins] The plugins to use.
 * @param  {Array}  [presets] The presets to use.
 * @return {Object} The Babel configuration object.
 */
function babelSetup({ plugins = [], presets = [] } = {}) {
    return {
        plugins: [...plugins],
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
    };
}

/**
 * Returns all entry point for a given technology and prefix.
 *
 * @param  {string} prefix    The tech name (react|angular-js) to match correct path.
 * @param  {string} extention The file extension to match.
 * @return {Object} An object of all formatted matches to use in webpack config entry option with filename
 *                  as key and path as value.
 */
const getComponents = ({ prefix, extention }) => {
    const files = {};
    const matches = glob.sync(`${COMPONENTS_PATH}/**/${prefix}/**/*.${extention}`);
    const fileNameRegexp = `(?:.*)/(.*).${extention}`;

    matches.forEach((match) => {
        files[match.match(fileNameRegexp)[1]] = match;
    });

    return files;
};

/**
 * Get all sass ressource files which contains ressources to share across all scss files.
 *
 * @return {Array} The array of ressource files.
 */
function getSassRessourcesFiles() {
    const ressourceFileNames = ['_mixins', '_variables', '_color-palette', '_functions'];

    // Sets the paths to match according to https://github.com/isaacs/minimatch documentation.
    const pathToMatch = `${CORE_PATH}/style/**/+(${ressourceFileNames.join('|')}).scss`;

    return glob.sync(pathToMatch);
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
        overlay: true,
        port: port || DEFAULT_PORT,
    };
}

module.exports = {
    babelSetup,
    getComponents,
    getSassRessourcesFiles,
    getWebpackDevServerConfig,
};
