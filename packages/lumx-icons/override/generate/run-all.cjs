#!/usr/bin/env node

const generateMergedFont = require('./generate-merged-font.cjs');
const generateSCSSAliases = require('./generate-scss-aliases.cjs');
const generateTSAliases = require('./generate-ts-aliases.cjs');
const generateSCSSOverride = require('./generate-scss-override.cjs');
const generateTSOverride = require('./generate-ts-override.cjs');
const generateOverrideFont = require('./generate-override-font.cjs');
const { cleanUpTmpDir } = require('./utils.cjs');

// Generate override font from our override SVG icons
generateOverrideFont()
    .then(() =>
        Promise.all([
            // Merge MDI with the override font
            generateMergedFont(),
            // Generate TS icon override const
            generateTSOverride(),
            // Generate SCSS MDI class override
            generateSCSSOverride(),
            // Generate TS icon alias const
            generateTSAliases(),
            // Generate SCSS MDI class aliases
            generateSCSSAliases(),
        ]),
    )
    .then(cleanUpTmpDir);
