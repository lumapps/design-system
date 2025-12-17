const { woff2, Font } = require('fonteditor-core');
const without = require('lodash/without');
const path = require('path');
const fs = require('fs/promises');

const overrideConfig = require('../override-icons/config.cjs');
const {
    MDI_FONT_PATH,
    OVERRIDE_FONT_PATH,
    GENERATED_FONT_DIR,
    MDI_FONT_NAME
} = require('./constants.cjs');

/**
 * Merge the MDI font with our override font.
 *
 * 1. Load MDI font from node_modules
 * 2. Load our override font
 * 3. List code points (locations in the font) where we want to override
 * 4. Merge our override font into MDI font
 * 5. Export all font file formats
 */
async function generateMergedFont() {
    console.debug('Generate merged font files...');

    const woff2InitPromise = woff2.init();
    const mdiFontPromise = fs.readFile(MDI_FONT_PATH);

    // Load our override font
    const overrideFontPromise = fs.readFile(OVERRIDE_FONT_PATH);
    const overrideFont = Font.create(await overrideFontPromise, { type: 'ttf' });

    // List code point that should be replaced in MDI
    const overrideCodePoints = Object.values(overrideConfig)
        .map(({ unicode, replace }) => replace && unicode)
        .filter(Boolean);

    // List all MDI code points
    const allMDICodePoints = Font.create(await mdiFontPromise, { type: 'ttf' })
        .find({ filter: () => true })
        .flatMap(({ unicode }) => unicode);

    // List all MDI code points without the overridden code point
    const subset = without(allMDICodePoints, ...overrideCodePoints);

    // Only load MDI icons that we do not override
    const mdiFont = Font.create(await mdiFontPromise, { type: 'ttf', subset });

    // Merge the MDI font without our override font
    mdiFont.merge(overrideFont);

    // Init needed to properly output woff2
    await woff2InitPromise;

    // Output font in all the formats supported by MDI
    const types = ['eot', 'ttf', 'woff', 'woff2'];
    await Promise.all(
        types.map((type) => {
            // Write font file
            const filePath = path.resolve(GENERATED_FONT_DIR, `${MDI_FONT_NAME}.${type}`);
            return fs.writeFile(filePath, mdiFont.write({ type }));
        }),
    );
}

module.exports = generateMergedFont;
