/* eslint-disable import/no-commonjs,import/unambiguous,import/no-nodejs-modules */
const path = require('path');

module.exports = {
    process(src, filename) {
        return `module.exports = ${JSON.stringify(path.basename(filename))};`;
    },
};
