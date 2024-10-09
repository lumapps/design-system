export {
    CSS_PREFIX,
    DIALOG_TRANSITION_DURATION,
    NOTIFICATION_TRANSITION_DURATION,
    TOOLTIP_HOVER_DELAY,
    TOOLTIP_LONG_PRESS_DELAY,
} from '@lumx/core/js/constants';

/**
 * Optional global `window` instance (not defined when running SSR).
 */
export const WINDOW = typeof window !== 'undefined' ? window : undefined;

/**
 * Optional global `document` instance (not defined when running SSR).
 */
export const DOCUMENT = typeof document !== 'undefined' ? document : undefined;

/**
 * Check if we are running in a true browser
 */
export const IS_BROWSER = typeof navigator !== 'undefined' && !navigator.userAgent.includes('jsdom');

/**
 * Visually hidden a11y utility class name
 */
export const VISUALLY_HIDDEN = 'visually-hidden';
