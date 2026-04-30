/**
 * Format a time-of-day as a locale-aware short time (e.g. `'10:30 AM'`,
 * `'10:30'`). Hour is `numeric` (not `'2-digit'`); some locales insert a
 * narrow no-break space (U+202F) before AM/PM.
 */
export function formatTime(date: Date, locale: string): string {
    return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}
