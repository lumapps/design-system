#!/usr/bin/env node

const optimizeSVGs = require('./optimize-svgs.cjs');
const generateMergedFont = require('./generate-merged-font.cjs');
const generateSCSSAliases = require('./generate-scss-aliases.cjs');
const generateSCSSOverride = require('./generate-scss-override.cjs');
const generateJSONIconLibrary = require('./generate-icon-library.cjs');
const generateTSExports = require('./generate-ts-exports.cjs');
const generateOverrideFont = require('./generate-override-font.cjs');
const { cleanUpTmpDir } = require('./utils.cjs');

(async () => {
    // Optimize our SVG files
    await optimizeSVGs();

    // Generate override font from our override SVG icons
    const scssFontPromise = generateOverrideFont().then(() => Promise.all([
        // Merge MDI with the override font
        generateMergedFont(),
        // Generate SCSS MDI class override
        generateSCSSOverride(),
        // Generate SCSS MDI class aliases
        generateSCSSAliases(),
    ]));

    // Generate Icon library and then the TS icons
    const typescriptPromise = generateJSONIconLibrary().then(generateTSExports);

    await Promise.all([scssFontPromise, typescriptPromise]);

    // Clean the tmp dir
    await cleanUpTmpDir();
})();
