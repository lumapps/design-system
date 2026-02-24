/**
 * Check if we are running in a true browser (not SSR and not jsdom test environment).
 */
export const IS_BROWSER = typeof window !== 'undefined' && !window.navigator.userAgent.includes('jsdom');

/**
 * Optional global `window` instance (not defined when running SSR).
 */
export const WINDOW = typeof window !== 'undefined' ? window : undefined;

/**
 * Optional global `document` instance (not defined when running SSR).
 */
export const DOCUMENT = typeof document !== 'undefined' ? document : undefined;
