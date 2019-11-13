import { Theme } from './constants';

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Change the theme.
 * This will change the theme of the demo site and the theme of LumX.
 * This will also cleanup the DOM and remove old themes styles and scripts.
 *
 * @see {@link /demo/constants.d.ts} for the possible value for the theme.
 *
 * @param  theme The theme to enable.
 * @return The promise of the change.
 */
declare function changeTheme(theme: Theme): Promise<Theme>;

/**
 * Set primary and secondary custom colors.
 *
 * @see {@link /demo/constants.d.ts} for the possible value for the theme.
 *
 * @param  theme The theme to apply the custom color palete on.
 * @return The promise of the change.
 */
declare function setDemoCustomColors(theme: Theme): Promise<Theme>;

/////////////////////////////

export { changeTheme, setDemoCustomColors };
