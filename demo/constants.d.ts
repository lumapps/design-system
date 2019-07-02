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
 */
declare const THEMES: { [key in Themes]: Theme };

/**
 * The default theme to use in the demo site at startup.
 */
declare const DEFAULT_THEME: Theme;

/////////////////////////////

export { THEMES, DEFAULT_THEME, Theme, Themes };
