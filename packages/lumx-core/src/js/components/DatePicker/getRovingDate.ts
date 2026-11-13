import { getCalendarDate, toCalendarDate, getDaysInMonth, snapDateToRange } from '../../utils/date/calendarDay';

export interface RovingDateOptions {
    /** The shown month (any date in the month). */
    month: Date;
    /** The last roving day (focused by a key, picked, or set by the wrapper). */
    rovingDate?: Date;
    /** The selected date. */
    value?: Date;
    /** Date before which days are out of range. */
    minDate?: Date;
    /** Date after which days are out of range. */
    maxDate?: Date;
    /** Today. Default: now. */
    today?: Date;
}

const isInMonth = (date: Date, month: Date) =>
    date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();

/**
 * Get the roving day of the calendar grid (the day button with `tabindex="0"`) in the shown month (SPEC 5.3).
 *
 * - The base day is the last roving day, else the selected date, else today.
 * - In the shown month: the base day. In another month (open on another month, month change with the buttons or
 *   the year input): the same day number in the shown month, or its last day if the day does not exist.
 * - Limited to the range (snapped to `minDate` or `maxDate`).
 *
 * @return The calendar date of the roving day, or `undefined` when no day of the shown month is in the range.
 */
export function getRovingDate({ month, rovingDate, value, minDate, maxDate, today = new Date() }: RovingDateOptions) {
    const base = rovingDate || value || today;
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const day = isInMonth(base, month)
        ? toCalendarDate(base)
        : getCalendarDate(year, monthIndex, Math.min(base.getDate(), getDaysInMonth(year, monthIndex)));
    const snapped = snapDateToRange(day, minDate, maxDate);
    return isInMonth(snapped, month) ? snapped : undefined;
}
