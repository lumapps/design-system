/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * Defines the allowed themes.
 */
declare enum Theme {
    lumapps = 'lumapps',
    material = 'material',
}

/**
 * The available themes in the demo site.
 */
declare const THEMES: { [key in Theme]: Theme };

/**
 * The default theme to use in the demo site at startup.
 */
declare const DEFAULT_THEME: Theme;

/////////////////////////////

export { THEMES, DEFAULT_THEME, Theme };
