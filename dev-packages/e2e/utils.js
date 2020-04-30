/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { readdirSync, existsSync } = require('fs');

// TODO: have a more elegant mechanism to ignore internal folders.
const getDirectories = (source) =>
    readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
        .map((dirent) => dirent.name);

const getFileContents = (file) => {
    try {
        if (existsSync(file)) {
            const contents = require(`../../${file}`);

            return contents;
        }
    } catch (exception) {
        console.error('error while retrieving contents from file', file);
    }

    return null;
};

module.exports = {
    getDirectories,
    getFileContents,
};
