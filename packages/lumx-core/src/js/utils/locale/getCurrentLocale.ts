/**
 * Get current browser locale (BCP-47 string).
 *
 * Reads `navigator.languages[0]` (the user's preferred language) with a
 * fallback to `navigator.language`.
 */
export const getCurrentLocale = (): string => navigator.languages?.[0] || navigator.language;
