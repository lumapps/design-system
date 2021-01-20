export { CSS_PREFIX, DIALOG_TRANSITION_DURATION, NOTIFICATION_TRANSITION_DURATION } from '@lumx/core/js/constants';

/**
 * Optional global `window` instance (not defined when running SSR).
 */
export const WINDOW = typeof window !== `undefined` ? window : undefined;

/**
 * Optional global `document` instance (not defined when running SSR).
 */
export const DOCUMENT = typeof document !== `undefined` ? document : undefined;
