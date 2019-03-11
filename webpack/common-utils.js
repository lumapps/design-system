const path = require('path');

/**
 * Gives an absolute path by resolving the provided relative path.
 *
 * @param  {string} pathName The relative path.
 * @return {string} The resolved absolute path.
 */
function getAbsolutePath(pathName) {
    return path.resolve(__dirname, pathName);
}

module.exports = {
    getAbsolutePath,
};
