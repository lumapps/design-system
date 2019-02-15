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

// Path relative constants.
const ROOT_PATH = getAbsolutePath('../');
const NODE_MODULES_PATH = `${ROOT_PATH}/node_modules`;
const SRC_PATH = getAbsolutePath('../src');
const CORE_PATH = `${SRC_PATH}/core`;
const COMPONENTS_PATH = `${SRC_PATH}/components`;
const DEMO_PATH = getAbsolutePath('../demo');

// Techology relative constants.
const TECH_PREFIX = {
    'angular-js': 'angular-js',
    react: 'react',
};

// Dev-server relative constants
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 4000;

module.exports = {
    COMPONENTS_PATH,
    CORE_PATH,
    DEFAULT_HOST,
    DEFAULT_PORT,
    DEMO_PATH,
    NODE_MODULES_PATH,
    ROOT_PATH,
    SRC_PATH,
    TECH_PREFIX,
};
