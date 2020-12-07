import range from 'lodash/range';
import mMoment, { Moment } from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(mMoment as any);

const DAYS_PER_WEEK = 7;

interface AnnotatedDate {
    date: Moment;
    isDisplayed: boolean;
    isClickable: boolean;
    isToday: boolean;
}

/**
 * Get the list of days in a week based on locale.
 *
 * @param  locale The locale using to generate the order of days in a week.
 * @return The list of days in a week based on locale.
 */
export function getWeekDays(locale: string): Moment[] {
    return range(DAYS_PER_WEEK).map((_, i) => moment().locale(locale).weekday(i));
}

/**
 * Get month calendar based on locale and start date.
 *
 * @param  locale        The locale using to generate the order of days in a week.
 * @param  selectedMonth The selected month.
 * @return The list of days in a week based on locale.
 */
export function getMonthCalendar(locale: string, selectedMonth?: Moment): Moment[] {
    const firstDayOfMonth = moment(selectedMonth).startOf('month');
    const endDayOfMonth = moment(selectedMonth).endOf('month');
    // The first day of the week depends on the locale used. In FR the first day is a monday but in EN the first day is sunday
    const firstDay = firstDayOfMonth.locale(locale).startOf('week');
    const monthRange = moment.range(firstDay.toDate(), endDayOfMonth.toDate());

    return Array.from(monthRange.by('day'));
}

/**
 * Get month calendar based on locale and start date.
 * Each day is annotated to know if they are displayed and/or clickable.
 *
 * @param  locale        The locale using to generate the order of days in a week.
 * @param  minDate       The first selectable date.
 * @param  maxDate       The last selectable date.
 * @param  selectedMonth The selected month.
 * @return The list of days in a week based on locale.
 */
export function getAnnotatedMonthCalendar(
    locale: string,
    minDate?: Date,
    maxDate?: Date,
    selectedMonth?: Moment,
): AnnotatedDate[] {
    const month = moment(selectedMonth).locale(locale).month();

    const clickableRange = moment.range(minDate!, maxDate!);

    return getMonthCalendar(locale, selectedMonth).map((date) => {
        return {
            date,
            isClickable: clickableRange.contains(date),
            isDisplayed: date.month() === month,
            isToday: date.isSame(moment(), 'day'),
        };
    });
}
