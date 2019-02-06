const path = require('path');

/**
 * Gives an absolute path by resolving the provided relative path.
 *
 * @param  {string} pathName The relative path.
 * @return {string} The resolved absolute path.
 */
const absolutePath = (pathName) => path.resolve(__dirname, pathName);

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

module.exports = {
    absolutePath,
    babelSetup,
};
