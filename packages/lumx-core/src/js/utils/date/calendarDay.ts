/**
 * Calendar days.
 *
 * One rule for every function here: the day of a `Date` is its **local** date (`getFullYear`, `getMonth`,
 * `getDate`). The time of day is ignored.
 *
 * A **calendar date** is the `Date` a date picker sets for a day: the `00:00 UTC` instant whose local date is the day.
 * - UTC offset `>= 0`: `00:00 UTC` of the day.
 * - UTC offset `< 0`: `00:00 UTC` of the next day (its local date is the given day).
 *
 * Day picks in the calendar grid, typed dates and dates snapped to the range are calendar dates, so every date set
 * by a date picker has the same time of day.
 */

/** Check that `date` is a valid date. */
export const isDateValid = (date?: Date | null): date is Date => date instanceof Date && !Number.isNaN(date.getTime());

/**
 * Get the calendar date of a day.
 *
 * The day overflows like the `Date` constructor (e.g. day `0` is the last day of the previous month).
 *
 * @param year       Full year (two-digit years are not mapped to 19xx).
 * @param monthIndex Month index (0 = January).
 * @param day        Day of the month.
 */
export function getCalendarDate(year: number, monthIndex: number, day: number): Date {
    // Normalize the local day (overflow, two-digit years).
    const local = new Date(0);
    local.setFullYear(year, monthIndex, day);
    const [y, m, d] = [local.getFullYear(), local.getMonth(), local.getDate()];

    const utc = new Date(0);
    utc.setUTCFullYear(y, m, d);
    // Negative UTC offset: 00:00 UTC is still the previous local day, use 00:00 UTC of the next day.
    if (utc.getDate() !== d) utc.setUTCFullYear(y, m, d + 1);
    return utc;
}

/** Get the calendar date of the day of `date`. */
export const toCalendarDate = (date: Date): Date =>
    getCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());

/** Number of the day of `date`, ordered like the days (`NaN` for an invalid date). */
const getDayNumber = (date: Date) => date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

/** Check that `date1` and `date2` are on the same day. `false` if one of them is not a valid date. */
export const isSameDay = (date1: Date, date2: Date): boolean =>
    isDateValid(date1) && isDateValid(date2) && getDayNumber(date1) === getDayNumber(date2);

/**
 * Check that the day of `date` is in the range (`minDate` and `maxDate` days included).
 * Same rule as the out-of-range (disabled) days of the calendar grid (see `getMonthCalendar`).
 */
export const isDateInRange = (date: Date, minDate?: Date, maxDate?: Date): boolean =>
    (!minDate || getDayNumber(date) >= getDayNumber(minDate)) &&
    (!maxDate || getDayNumber(date) <= getDayNumber(maxDate));

/**
 * Snap a date to the range: the calendar date of the `minDate` day when `date` is before the range, the calendar
 * date of the `maxDate` day when it is after. Returns `date` itself when it is in the range.
 */
export function snapDateToRange(date: Date, minDate?: Date, maxDate?: Date): Date {
    if (minDate && getDayNumber(date) < getDayNumber(minDate)) return toCalendarDate(minDate);
    if (maxDate && getDayNumber(date) > getDayNumber(maxDate)) return toCalendarDate(maxDate);
    return date;
}

const pad = (value: number, length: number) => String(value).padStart(length, '0');

/** `YYYY-MM-DD` key of the day of `date` (the `data-date` attribute of a calendar grid day). */
export const getDateKey = (date: Date): string =>
    `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`;

/** Parse a `YYYY-MM-DD` key (see {@link getDateKey}) to its calendar date. `undefined` when not a valid key. */
export function parseDateKey(key: string | null | undefined): Date | undefined {
    const match = key ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(key) : null;
    if (!match) return undefined;
    const [year, month, day] = match.slice(1).map(Number);
    const date = getCalendarDate(year, month - 1, day);
    return getDateKey(date) === key ? date : undefined;
}

/** Number of days in a month (`monthIndex`: 0 = January). */
export function getDaysInMonth(year: number, monthIndex: number): number {
    const date = new Date(0);
    date.setFullYear(year, monthIndex + 1, 0);
    return date.getDate();
}

/**
 * Add a number of months to a date, on the first day of the month (no month length mismatch).
 * Keeps the time of day.
 */
export function addMonthResetDay(date: Date, monthOffset: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setDate(1);
    newDate.setMonth(date.getMonth() + monthOffset);
    return newDate;
}
