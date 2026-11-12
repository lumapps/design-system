import { parseLocale } from '../locale/parseLocale';
import { Locale } from '../locale/types';
import { getMonthCalendar } from './getMonthCalendar';
import { getCalendarDate } from './calendarDay';
import { describeInTimeZones } from '../../../testing/timeZones';

/** Calendar date of a day of February 2017. */
const day = (date: number) => getCalendarDate(2017, 1, date);

describeInTimeZones(getMonthCalendar.name, () => {
    it('should generate calendar', () => {
        const referenceDate = day(3);
        const french = parseLocale('fr') as Locale;
        const month = getMonthCalendar(french, referenceDate);

        expect(month).toEqual({
            weekDays: [
                { long: 'lundi', letter: 'L', number: 1 },
                { long: 'mardi', letter: 'M', number: 2 },
                { long: 'mercredi', letter: 'M', number: 3 },
                { long: 'jeudi', letter: 'J', number: 4 },
                { long: 'vendredi', letter: 'V', number: 5 },
                { long: 'samedi', letter: 'S', number: 6 },
                { long: 'dimanche', letter: 'D', number: 0 },
            ],
            weeks: [
                {
                    '3': { date: day(1) },
                    '4': { date: day(2) },
                    '5': { date: day(3) },
                    '6': { date: day(4) },
                    '0': { date: day(5) },
                },
                {
                    '1': { date: day(6) },
                    '2': { date: day(7) },
                    '3': { date: day(8) },
                    '4': { date: day(9) },
                    '5': { date: day(10) },
                    '6': { date: day(11) },
                    '0': { date: day(12) },
                },
                {
                    '1': { date: day(13) },
                    '2': { date: day(14) },
                    '3': { date: day(15) },
                    '4': { date: day(16) },
                    '5': { date: day(17) },
                    '6': { date: day(18) },
                    '0': { date: day(19) },
                },
                {
                    '1': { date: day(20) },
                    '2': { date: day(21) },
                    '3': { date: day(22) },
                    '4': { date: day(23) },
                    '5': { date: day(24) },
                    '6': { date: day(25) },
                    '0': { date: day(26) },
                },
                {
                    '1': { date: day(27) },
                    '2': { date: day(28) },
                },
                // Empty row (used for padding to avoid layout shift)
                {},
            ],
        });
    });

    it('should generate calendar with sunday as start of week and mark dates in range', () => {
        const referenceDate = day(3);
        // Range edges with a local time of day (not calendar dates).
        const minDate = new Date(2017, 1, 6, 23, 30);
        const maxDate = new Date(2017, 1, 10);
        const englishUS = parseLocale('en-US') as Locale;
        const month = getMonthCalendar(englishUS, referenceDate, minDate, maxDate);

        expect(month).toEqual({
            weekDays: [
                { long: 'Sunday', letter: 'S', number: 0 },
                { long: 'Monday', letter: 'M', number: 1 },
                { long: 'Tuesday', letter: 'T', number: 2 },
                { long: 'Wednesday', letter: 'W', number: 3 },
                { long: 'Thursday', letter: 'T', number: 4 },
                { long: 'Friday', letter: 'F', number: 5 },
                { long: 'Saturday', letter: 'S', number: 6 },
            ],
            weeks: [
                {
                    '3': { date: day(1), isOutOfRange: true },
                    '4': { date: day(2), isOutOfRange: true },
                    '5': { date: day(3), isOutOfRange: true },
                    '6': { date: day(4), isOutOfRange: true },
                },
                {
                    '0': { date: day(5), isOutOfRange: true },
                    '1': { date: day(6) },
                    '2': { date: day(7) },
                    '3': { date: day(8) },
                    '4': { date: day(9) },
                    '5': { date: day(10) },
                    '6': { date: day(11), isOutOfRange: true },
                },
                {
                    '0': { date: day(12), isOutOfRange: true },
                    '1': { date: day(13), isOutOfRange: true },
                    '2': { date: day(14), isOutOfRange: true },
                    '3': { date: day(15), isOutOfRange: true },
                    '4': { date: day(16), isOutOfRange: true },
                    '5': { date: day(17), isOutOfRange: true },
                    '6': { date: day(18), isOutOfRange: true },
                },
                {
                    '0': { date: day(19), isOutOfRange: true },
                    '1': { date: day(20), isOutOfRange: true },
                    '2': { date: day(21), isOutOfRange: true },
                    '3': { date: day(22), isOutOfRange: true },
                    '4': { date: day(23), isOutOfRange: true },
                    '5': { date: day(24), isOutOfRange: true },
                    '6': { date: day(25), isOutOfRange: true },
                },
                {
                    '0': { date: day(26), isOutOfRange: true },
                    '1': { date: day(27), isOutOfRange: true },
                    '2': { date: day(28), isOutOfRange: true },
                },
                // Empty row (used for padding to avoid layout shift)
                {},
            ],
        });
    });
});
