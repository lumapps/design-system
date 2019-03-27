/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * Defines the allowed themes.
 */
declare enum Themes {
    lumapps = 'lumapps',
    material = 'material',
}
declare type Theme = Themes;

/**
 * The available themes in the demo site.
 *
 * @type {Object}
 * @constant
 * @readonly
 */
declare const THEMES: { [key: Theme]: Theme };

/**
 * The default theme to use in the demo site at startup.
 *
 * @type {string}
 * @constant
 * @readonly
 */
declare const DEFAULT_THEME: Theme;

/////////////////////////////

export { THEMES, DEFAULT_THEME, Theme, Themes };
