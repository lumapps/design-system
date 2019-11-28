import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

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
    return [0, 1, 2, 3, 4, 5, 6].map((_, i) =>
        moment()
            .locale(locale)
            .weekday(i)
            .format('dddd')
            .slice(0, 1)
            .toUpperCase(),
    );
}

/**
 * Get month calendar based on locale and start date.
 *
 * @param  {string} locale       The locale using to generate the order of days in a week.
 * @param  {int}    monthFromNow The number of month from now for which we want the calendar.
 * @return {Array}  The list of days in a week based on locale.
 */
function getMonthCalendar(locale, monthFromNow = 0) {
    const firstDay = moment()
        .locale(locale)
        .add(monthFromNow, 'months')
        .startOf('month');
    const endDay = moment()
        .locale(locale)
        .add(monthFromNow, 'months')
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
 * @param  {string} locale       The locale using to generate the order of days in a week.
 * @param  {Object} minDate      The first selectable date.
 * @param  {Object} maxDate      The last selectable date.
 * @param  {int}    monthFromNow The number of month from now for which we want the calendar.
 * @return {Array}  The list of days in a week based on locale.
 */
function getAnnotatedMonthCalendar(locale, minDate = undefined, maxDate = undefined, monthFromNow = 0) {
    const month = moment()
        .locale(locale)
        .add(monthFromNow, 'months')
        .month();

    const clickableRange = moment().range(minDate, maxDate);

    return getMonthCalendar(locale, monthFromNow).map((date) => {
        return {
            date,
            isDisplayed: date.month() === month,
            isClickable: clickableRange.contains(date),
        };
    });
}

/////////////////////////////

export { getWeekDays, getMonthCalendar, getAnnotatedMonthCalendar };
