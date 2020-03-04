/* eslint-disable unicorn/prefer-spread */
import range from 'lodash/range';
import mMoment, { Moment } from 'moment';
import { extendMoment } from 'moment-range';

// @ts-ignore
const moment = extendMoment(mMoment);

const DAYS_PER_WEEK = 7;

interface AnnotatedDate {
    date: Moment;
    isDisplayed: boolean;
    isClickable: boolean;
    isToday: boolean;
}

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Get the list of days in a week based on locale.
 *
 * @param  locale The locale using to generate the order of days in a week.
 * @return The list of days in a week based on locale.
 */
function getWeekDays(locale: string): Moment[] {
    return range(DAYS_PER_WEEK).map((_, i) =>
        moment()
            .locale(locale)
            .weekday(i),
    );
}

/**
 * Get month calendar based on locale and start date.
 *
 * @param  locale      The locale using to generate the order of days in a week.
 * @param  today       The current date.
 * @param  monthOffset The number of month from now for which we want the calendar.
 * @return The list of days in a week based on locale.
 */
function getMonthCalendar(locale: string, today?: Moment, monthOffset = 0): Moment[] {
    const firstDay = moment(today)
        .locale(locale)
        .add(monthOffset, 'months')
        .startOf('month');
    const endDay = moment(today)
        .locale(locale)
        .add(monthOffset, 'months')
        .endOf('month');

    const monthRange = moment.range(firstDay, endDay);

    const weeks = Array.from(monthRange.by('week'));

    const calendar = [];
    for (const week of weeks) {
        const firstWeekDay = moment(week).startOf('week');
        const lastWeekDay = moment(week).endOf('week');
        const weekRange = moment.range(firstWeekDay, lastWeekDay);
        calendar.push(...Array.from(weekRange.by('day')));
    }

    return calendar;
}

/**
 * Get month calendar based on locale and start date.
 * Each day is annotated to know if they are displayed and/or clickable.
 *
 * @param  locale      The locale using to generate the order of days in a week.
 * @param  minDate     The first selectable date.
 * @param  maxDate     The last selectable date.
 * @param  today       The current date.
 * @param  monthOffset The number of month from now for which we want the calendar.
 * @return The list of days in a week based on locale.
 */
function getAnnotatedMonthCalendar(
    locale: string,
    minDate?: Date,
    maxDate?: Date,
    today?: Moment,
    monthOffset?: number,
): AnnotatedDate[] {
    const month = moment(today)
        .locale(locale)
        .add(monthOffset, 'months')
        .month();

    const clickableRange = moment.range(minDate!, maxDate!);

    return getMonthCalendar(locale, today, monthOffset).map((date) => {
        return {
            date,
            isClickable: clickableRange.contains(date),
            isDisplayed: date.month() === month,
            isToday: date.isSame(moment(), 'day'),
        };
    });
}

/////////////////////////////

export { getWeekDays, getMonthCalendar, getAnnotatedMonthCalendar };
