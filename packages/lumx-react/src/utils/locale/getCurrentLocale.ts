/**
 * Get current browser locale.
 */
export const getCurrentLocale = (): string => navigator.languages?.[0] || navigator.language;
