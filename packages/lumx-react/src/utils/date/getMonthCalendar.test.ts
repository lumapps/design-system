import { parseLocale } from '@lumx/react/utils/locale/parseLocale';
import { Locale } from '@lumx/react/utils/locale/types';
import { getMonthCalendar } from './getMonthCalendar';

describe(getMonthCalendar.name, () => {
    it('should generate calendar', () => {
        const referenceDate = new Date('2017-02-03');
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
                    '3': { date: new Date('2017-02-01') },
                    '4': { date: new Date('2017-02-02') },
                    '5': { date: new Date('2017-02-03') },
                    '6': { date: new Date('2017-02-04') },
                    '0': { date: new Date('2017-02-05') },
                },
                {
                    '1': { date: new Date('2017-02-06') },
                    '2': { date: new Date('2017-02-07') },
                    '3': { date: new Date('2017-02-08') },
                    '4': { date: new Date('2017-02-09') },
                    '5': { date: new Date('2017-02-10') },
                    '6': { date: new Date('2017-02-11') },
                    '0': { date: new Date('2017-02-12') },
                },
                {
                    '1': { date: new Date('2017-02-13') },
                    '2': { date: new Date('2017-02-14') },
                    '3': { date: new Date('2017-02-15') },
                    '4': { date: new Date('2017-02-16') },
                    '5': { date: new Date('2017-02-17') },
                    '6': { date: new Date('2017-02-18') },
                    '0': { date: new Date('2017-02-19') },
                },
                {
                    '1': { date: new Date('2017-02-20') },
                    '2': { date: new Date('2017-02-21') },
                    '3': { date: new Date('2017-02-22') },
                    '4': { date: new Date('2017-02-23') },
                    '5': { date: new Date('2017-02-24') },
                    '6': { date: new Date('2017-02-25') },
                    '0': { date: new Date('2017-02-26') },
                },
                {
                    '1': { date: new Date('2017-02-27') },
                    '2': { date: new Date('2017-02-28') },
                },
                // Empty row (used for padding to avoid layout shift)
                {},
            ],
        });
    });

    it('should generate calendar with sunday as start of week and mark dates in range', () => {
        const referenceDate = new Date('2017-02-03');
        const minDate = new Date('2017-02-06');
        const maxDate = new Date('2017-02-10');
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
                    '3': { date: new Date('2017-02-01'), isOutOfRange: true },
                    '4': { date: new Date('2017-02-02'), isOutOfRange: true },
                    '5': { date: new Date('2017-02-03'), isOutOfRange: true },
                    '6': { date: new Date('2017-02-04'), isOutOfRange: true },
                },
                {
                    '0': { date: new Date('2017-02-05'), isOutOfRange: true },
                    '1': { date: new Date('2017-02-06') },
                    '2': { date: new Date('2017-02-07') },
                    '3': { date: new Date('2017-02-08') },
                    '4': { date: new Date('2017-02-09') },
                    '5': { date: new Date('2017-02-10') },
                    '6': { date: new Date('2017-02-11'), isOutOfRange: true },
                },
                {
                    '0': { date: new Date('2017-02-12'), isOutOfRange: true },
                    '1': { date: new Date('2017-02-13'), isOutOfRange: true },
                    '2': { date: new Date('2017-02-14'), isOutOfRange: true },
                    '3': { date: new Date('2017-02-15'), isOutOfRange: true },
                    '4': { date: new Date('2017-02-16'), isOutOfRange: true },
                    '5': { date: new Date('2017-02-17'), isOutOfRange: true },
                    '6': { date: new Date('2017-02-18'), isOutOfRange: true },
                },
                {
                    '0': { date: new Date('2017-02-19'), isOutOfRange: true },
                    '1': { date: new Date('2017-02-20'), isOutOfRange: true },
                    '2': { date: new Date('2017-02-21'), isOutOfRange: true },
                    '3': { date: new Date('2017-02-22'), isOutOfRange: true },
                    '4': { date: new Date('2017-02-23'), isOutOfRange: true },
                    '5': { date: new Date('2017-02-24'), isOutOfRange: true },
                    '6': { date: new Date('2017-02-25'), isOutOfRange: true },
                },
                {
                    '0': { date: new Date('2017-02-26'), isOutOfRange: true },
                    '1': { date: new Date('2017-02-27'), isOutOfRange: true },
                    '2': { date: new Date('2017-02-28'), isOutOfRange: true },
                },
                // Empty row (used for padding to avoid layout shift)
                {},
            ],
        });
    });
});
