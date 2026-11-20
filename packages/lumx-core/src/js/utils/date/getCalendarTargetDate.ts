import { getCalendarDate, getDaysInMonth, isDateInRange, snapDateToRange } from './calendarDay';

/** A keyboard move in the calendar grid. */
export type CalendarMove =
    /** Right arrow. */
    | 'nextDay'
    /** Left arrow. */
    | 'previousDay'
    /** Down arrow. */
    | 'nextWeek'
    /** Up arrow. */
    | 'previousWeek'
    /** Page Down: same day number in the next month (last day if missing). */
    | 'nextMonth'
    /** Page Up: same day number in the previous month (last day if missing). */
    | 'previousMonth'
    /** Shift+Page Down: same day and month in the next year (last day if missing). */
    | 'nextYear'
    /** Shift+Page Up: same day and month in the previous year (last day if missing). */
    | 'previousYear'
    /** Home: first day of the week row. */
    | 'weekStart'
    /** End: last day of the week row. */
    | 'weekEnd'
    /** Ctrl+Home: first day of the month. */
    | 'monthStart'
    /** Ctrl+End: last day of the month. */
    | 'monthEnd';

export interface CalendarTargetOptions {
    /** Date before which days are out of range. */
    minDate?: Date;
    /** Date after which days are out of range. */
    maxDate?: Date;
    /** First day of the week (0 = Sunday), for the week row moves. Default: Monday. */
    weekStartDay?: number;
}

/** Same day number in another month (last day of the month if the day does not exist). */
function getSameDayInMonth(year: number, monthIndex: number, day: number): Date {
    return getCalendarDate(year, monthIndex, Math.min(day, getDaysInMonth(year, monthIndex)));
}

/**
 * Get the target date of a keyboard move in the calendar grid, from the local day of `date`.
 *
 * - Day, week, month and year moves: `undefined` when the target day is out of the range (APG grid: focus does not
 *   move).
 * - Week row and month edge moves: the target stays in the month of `date` (the week row of the calendar grid only
 *   shows the days of its month) and is snapped to the range.
 *
 * The target is a calendar date (see `getCalendarDate`).
 */
export function getCalendarTargetDate(
    date: Date,
    move: CalendarMove,
    { minDate, maxDate, weekStartDay = 1 }: CalendarTargetOptions = {},
): Date | undefined {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const lastDay = getDaysInMonth(year, month);
    const weekDayIndex = (date.getDay() - weekStartDay + 7) % 7;

    const inRange = (target: Date) => (isDateInRange(target, minDate, maxDate) ? target : undefined);
    const snapped = (target: Date) => snapDateToRange(target, minDate, maxDate);
    switch (move) {
        case 'nextDay':
            return inRange(getCalendarDate(year, month, day + 1));
        case 'previousDay':
            return inRange(getCalendarDate(year, month, day - 1));
        case 'nextWeek':
            return inRange(getCalendarDate(year, month, day + 7));
        case 'previousWeek':
            return inRange(getCalendarDate(year, month, day - 7));
        case 'nextMonth':
            return inRange(getSameDayInMonth(year, month + 1, day));
        case 'previousMonth':
            return inRange(getSameDayInMonth(year, month - 1, day));
        case 'nextYear':
            return inRange(getSameDayInMonth(year + 1, month, day));
        case 'previousYear':
            return inRange(getSameDayInMonth(year - 1, month, day));
        case 'weekStart':
            return snapped(getCalendarDate(year, month, Math.max(day - weekDayIndex, 1)));
        case 'weekEnd':
            return snapped(getCalendarDate(year, month, Math.min(day + 6 - weekDayIndex, lastDay)));
        case 'monthStart':
            return snapped(getCalendarDate(year, month, 1));
        case 'monthEnd':
            return snapped(getCalendarDate(year, month, lastDay));
        default:
            return undefined;
    }
}
