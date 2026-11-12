import { isDateValid } from './calendarDay';

/** Options of the long date format (the text of a date picker field). */
export const LONG_DATE_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

/**
 * Format a date in the long format of the locale (ex: `November 12, 2026`, `12 novembre 2026`).
 * Empty string when there is no valid date.
 */
export const formatDate = (date: Date | undefined, locale: string): string =>
    isDateValid(date) ? date.toLocaleDateString(locale, LONG_DATE_FORMAT) : '';

/** Format the day number of a date in the locale (only the digits when the locale format has digits). */
export function formatDayNumber(locale: string, date: Date): string {
    const formattedDate = date.toLocaleDateString(locale, { day: 'numeric' });
    if (formattedDate.match(/\d/)) return formattedDate.replace(/\D*(\d+)\D*/g, '$1');
    return formattedDate;
}
