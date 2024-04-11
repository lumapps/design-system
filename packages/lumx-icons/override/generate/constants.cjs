const path = require('path');
const { ROOT_PATH } = require('../../../../configs/path');

const INPUT_ICON_OVERRIDE_DIR = path.resolve(__dirname, '..', 'override-icons');
const GENERATED_DIR = path.resolve(__dirname, '..', 'generated');
const GENERATED_TMP_DIR = path.resolve(GENERATED_DIR, 'tmp');
const GENERATED_FONT_DIR = path.resolve(GENERATED_DIR, 'fonts');
const OUT_BASE_NAME = 'mdi';
const OUT_OVERRIDE_NAME = 'override';
const OUT_ALIASES_NAME = 'aliases';
const MDI_FONT_NAME = 'materialdesignicons-webfont';
const MDI_FONT_PATH = path.resolve(ROOT_PATH, `node_modules/@mdi/font/fonts/${MDI_FONT_NAME}.ttf`);
const OVERRIDE_FONT_NAME = 'override';
const OVERRIDE_FONT_PATH = path.resolve(GENERATED_TMP_DIR, `${OVERRIDE_FONT_NAME}.ttf`);
const JSON_ICON_LIBRARY_FILE = 'icon-library.json';

module.exports = {
    INPUT_ICON_OVERRIDE_DIR,
    GENERATED_DIR,
    GENERATED_TMP_DIR,
    GENERATED_FONT_DIR,
    OUT_BASE_NAME,
    OUT_OVERRIDE_NAME,
    OUT_ALIASES_NAME,
    MDI_FONT_NAME,
    MDI_FONT_PATH,
    OVERRIDE_FONT_NAME,
    OVERRIDE_FONT_PATH,
    JSON_ICON_LIBRARY_FILE,
};
