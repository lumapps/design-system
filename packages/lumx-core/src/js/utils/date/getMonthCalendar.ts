import { getWeekDays, WeekDayInfo } from './getWeekDays';
import { Locale } from '../locale/types';
import { getCalendarDate, getDaysInMonth, isDateInRange } from './calendarDay';

type AnnotatedDay = { date: Date; isOutOfRange?: boolean };
type AnnotatedWeek = Partial<Record<number, AnnotatedDay>>;

interface MonthCalendar {
    weekDays: Array<WeekDayInfo>;
    weeks: Array<AnnotatedWeek>;
}

/** Up to 6 rows can appear in a month calendar => 4 weeks + 1 start of month partial week + 1 send of month partial week */
const MONTH_ROW_COUNT = 6;

/**
 * Get month calendar.
 * A list of weeks with days indexed by week day number.
 *
 * Each day date is a calendar date (`00:00 UTC` instant whose local date is the day, see `getCalendarDate`).
 * Days out of the range (`minDate` and `maxDate` included in the range) are marked `isOutOfRange`.
 */
export const getMonthCalendar = (
    locale: Locale,
    referenceDate = new Date(),
    rangeMinDate?: Date,
    rangeMaxDate?: Date,
): MonthCalendar => {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const dayCount = getDaysInMonth(year, month);

    const weekDays = getWeekDays(locale);
    const lastDayOfWeek = weekDays[weekDays.length - 1];

    const weeks: Array<AnnotatedWeek> = [];
    let week: AnnotatedWeek = {};

    for (let day = 1; weeks.length < MONTH_ROW_COUNT; day += 1) {
        const date = getCalendarDate(year, month, day);
        const weekDayNumber = date.getDay();

        if (day <= dayCount) {
            const annotatedDay: AnnotatedDay = { date };
            // If a range is specified, check if the day is out of range.
            if (!isDateInRange(date, rangeMinDate, rangeMaxDate)) annotatedDay.isOutOfRange = true;
            week[weekDayNumber] = annotatedDay;
        }

        if (weekDayNumber === lastDayOfWeek.number) {
            weeks.push(week);
            week = {};
        }
    }

    return { weeks, weekDays };
};
