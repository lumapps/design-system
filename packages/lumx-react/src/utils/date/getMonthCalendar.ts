import { getWeekDays, WeekDayInfo } from '@lumx/react/utils/date/getWeekDays';
import { Locale } from '@lumx/react/utils/locale/types';
import { last } from '@lumx/core/js/utils/collection/last';

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
 * A list of weeks with days indexed by week day number
 */
export const getMonthCalendar = (
    locale: Locale,
    referenceDate = new Date(),
    rangeMinDate?: Date,
    rangeMaxDate?: Date,
): MonthCalendar => {
    const month = referenceDate.getMonth();
    const iterDate = new Date(referenceDate);
    iterDate.setDate(1);

    const minDate = rangeMinDate && new Date(rangeMinDate);
    const maxDate = rangeMaxDate && new Date(rangeMaxDate);
    // Reset time to compare dates only.
    iterDate.setUTCHours(0, 0, 0, 0);
    minDate?.setUTCHours(0, 0, 0, 0);
    maxDate?.setUTCHours(0, 0, 0, 0);

    const weekDays = getWeekDays(locale);
    const lastDayOfWeek = last(weekDays);

    const weeks: Array<AnnotatedWeek> = [];
    let week: AnnotatedWeek = {};
    let rowCount = 0;

    while (rowCount < MONTH_ROW_COUNT) {
        const weekDayNumber = iterDate.getDay();
        const day: AnnotatedDay = { date: new Date(iterDate.getTime()) };

        // If a range is specified, check if the day is out of range.
        // min and max date are included within the valid range.
        if ((minDate && iterDate < minDate) || (maxDate && iterDate > maxDate)) {
            day.isOutOfRange = true;
        }

        if (iterDate.getMonth() === month) {
            week[weekDayNumber] = day;
        }

        if (weekDayNumber === lastDayOfWeek?.number) {
            weeks.push(week);
            rowCount += 1;
            week = {};
        }
        iterDate.setDate(iterDate.getDate() + 1);
    }
    if (Object.keys(week).length) weeks.push(week);

    return { weeks, weekDays };
};
