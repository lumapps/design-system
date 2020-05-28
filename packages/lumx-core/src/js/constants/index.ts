/**
 * The prefix to use for the CSS classes.
 */
export const CSS_PREFIX = 'lumx';

/**
 * Key codes.
 */
export * from './keycodes';

/**
 * Global themes.
 */
import { THEME as lumapps } from './generated/lumapps';
import { THEME as material } from './generated/material';
export const GLOBAL_THEMES = { lumapps, material };

/**
 * Animation duration constants. Take into consideration that if you change one of these variables,
 * you need to update their scss counterpart as well
 */
export const DIALOG_TRANSITION_DURATION = 400;
export const NOTIFICATION_TRANSITION_DURATION = 200;
