export {
    BACKSPACE_KEY_CODE,
    CSS_PREFIX,
    DOWN_KEY_CODE,
    ENTER_KEY_CODE,
    SPACE_KEY_CODE,
    ESCAPE_KEY_CODE,
    LEFT_KEY_CODE,
    RIGHT_KEY_CODE,
    TAB_KEY_CODE,
    UP_KEY_CODE,
    DIALOG_TRANSITION_DURATION,
    NOTIFICATION_TRANSITION_DURATION,
} from '@lumx/core/js/constants';

/**
 * The prefix to use to name the React component.
 */
export const COMPONENT_PREFIX = '';

/**
 * Optional global `window` instance (not defined when running SSR).
 */
export const WINDOW = typeof window !== `undefined` ? window : undefined;

/**
 * Optional global `document` instance (not defined when running SSR).
 */
export const DOCUMENT = typeof document !== `undefined` ? document : undefined;
