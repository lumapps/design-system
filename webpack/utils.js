const path = require('path');
const glob = require('glob');

/**
 * Gives an absolute path by resolving the provided relative path.
 *
 * @param  {string} pathName The relative path.
 * @return {string} The resolved absolute path.
 */
function absolutePath(pathName) {
    return path.resolve(__dirname, pathName);
}

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
 * Get all sass ressource files which contains ressources to share across all scss files.
 *
 * @return {Array} The array of ressource files.
 */
function getSassRessourcesFiles() {
    const ressourceFileNames = ['_mixins', '_variables', '_color-palette', '_functions'];

    // Sets the paths to match according to https://github.com/isaacs/minimatch documentation.
    const pathToMatch = `${absolutePath('../src/core/style')}/**/+(${ressourceFileNames.join('|')}).scss`;

    return glob.sync(pathToMatch);
}

module.exports = {
    absolutePath,
    babelSetup,
    getSassRessourcesFiles,
};
