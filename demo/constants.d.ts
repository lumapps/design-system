/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * Defines the allowed themes.
 */
declare type Theme = 'lumapps' | 'material';

/**
 * The available themes in the demo site.
 *
 * @type {Array<string>}
 * @constant
 * @readonly
 */
declare const THEMES: Array<Theme>;

/**
 * The default theme to use in the demo site at startup.
 *
 * @type {string}
 * @constant
 * @readonly
 */
declare const DEFAULT_THEME: Theme;

/////////////////////////////

export { THEMES, DEFAULT_THEME, Theme };
