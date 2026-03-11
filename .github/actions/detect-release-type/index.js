/* eslint-disable */

const fs = require('fs');
const { CHANGELOG_PATH } = require('../../../configs/path');
const { detectReleaseType } = require('@lumx/changelog-utils');

async function main() {
    const content = await fs.promises.readFile(CHANGELOG_PATH, 'utf8');
    const result = detectReleaseType(content);
    console.log(`Detected release type: ${result.releaseType}`);
    console.log(`Sections found: ${Object.keys(result.sections).join(', ')}`);
    return result;
}

module.exports = main;
