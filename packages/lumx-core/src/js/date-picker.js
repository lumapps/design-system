/* eslint-disable unicorn/prefer-spread */
import range from 'lodash/range';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const DAYS_PER_WEEK = 7;

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Get the list of days in a week based on locale.
 *
 * @param  {string} locale The locale using to generate the order of days in a week.
 * @return {Array}  The list of days in a week based on locale.
 */
function getWeekDays(locale) {
    return range(DAYS_PER_WEEK).map((_, i) =>
        moment()
            .locale(locale)
            .weekday(i),
    );
}

/**
 * Get month calendar based on locale and start date.
 *
 * @param  {string} locale      The locale using to generate the order of days in a week.
 * @param  {Object} today       The current date.
 * @param  {int}    monthOffset The number of month from now for which we want the calendar.
 * @return {Array}  The list of days in a week based on locale.
 */
function getMonthCalendar(locale, today = moment(), monthOffset = 0) {
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
 * @param  {string} locale      The locale using to generate the order of days in a week.
 * @param  {Object} minDate     The first selectable date.
 * @param  {Object} maxDate     The last selectable date.
 * @param  {Object} today       The current date.
 * @param  {int}    monthOffset The number of month from now for which we want the calendar.
 * @return {Array}  The list of days in a week based on locale.
 */
function getAnnotatedMonthCalendar(
    locale,
    minDate = undefined,
    maxDate = undefined,
    today = moment(),
    monthOffset = 0,
) {
    const month = moment(today)
        .locale(locale)
        .add(monthOffset, 'months')
        .month();

    const clickableRange = moment.range(minDate, maxDate);

    return getMonthCalendar(locale, today, monthOffset).map((date) => {
        return {
            date,
            isDisplayed: date.month() === month,
            isClickable: clickableRange.contains(date),
            isToday: date.isSame(moment(today), 'day'),
        };
    });
}

/////////////////////////////

export { getWeekDays, getMonthCalendar, getAnnotatedMonthCalendar };
