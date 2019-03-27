/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The available themes in the demo site.
 *
 * @type {Object}
 * @constant
 * @readonly
 */
const THEMES = {
    lumapps: 'lumapps',
    material: 'material',
};

/**
 * The default theme to use in the demo site at startup.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const DEFAULT_THEME = THEMES[Object.keys(THEMES)[0]];

/////////////////////////////

export { DEFAULT_THEME, THEMES };
