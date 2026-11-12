import { getCalendarDate, getDaysInMonth, isDateInRange } from './calendarDay';

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
    | 'previousYear';

export interface CalendarTargetOptions {
    /** Date before which days are out of range. */
    minDate?: Date;
    /** Date after which days are out of range. */
    maxDate?: Date;
}

/** Same day number in another month (last day of the month if the day does not exist). */
function getSameDayInMonth(year: number, monthIndex: number, day: number): Date {
    const target = new Date(0);
    target.setFullYear(year, monthIndex, 1);
    const days = getDaysInMonth(target.getFullYear(), target.getMonth());
    return getCalendarDate(target.getFullYear(), target.getMonth(), Math.min(day, days));
}

/**
 * Get the target date of a keyboard move in the calendar grid, from the local day of `date`.
 *
 * Returns `undefined` when the target day is out of the range (APG grid: focus does not move).
 * Home/End (week row) are grid moves: see `setupCalendarGrid`.
 *
 * The target is a calendar date (`00:00 UTC` instant whose local date is the target day, see `getCalendarDate`).
 */
export function getCalendarTargetDate(
    date: Date,
    move: CalendarMove,
    { minDate, maxDate }: CalendarTargetOptions = {},
): Date | undefined {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    let target: Date;
    switch (move) {
        case 'nextDay':
            target = getCalendarDate(year, month, day + 1);
            break;
        case 'previousDay':
            target = getCalendarDate(year, month, day - 1);
            break;
        case 'nextWeek':
            target = getCalendarDate(year, month, day + 7);
            break;
        case 'previousWeek':
            target = getCalendarDate(year, month, day - 7);
            break;
        case 'nextMonth':
            target = getSameDayInMonth(year, month + 1, day);
            break;
        case 'previousMonth':
            target = getSameDayInMonth(year, month - 1, day);
            break;
        case 'nextYear':
            target = getSameDayInMonth(year + 1, month, day);
            break;
        case 'previousYear':
            target = getSameDayInMonth(year - 1, month, day);
            break;
        default:
            return undefined;
    }
    return isDateInRange(target, minDate, maxDate) ? target : undefined;
}
