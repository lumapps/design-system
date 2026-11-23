import { getCalendarDate } from './calendarDay';
import { getCalendarTargetDate } from './getCalendarTargetDate';
import { describeInTimeZones } from '../../../testing/timeZones';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

describeInTimeZones(getCalendarTargetDate.name, () => {
    describe('day and week moves', () => {
        it('should move by one day', () => {
            expect(getCalendarTargetDate(day(2026, 11, 12), 'nextDay')).toEqual(day(2026, 11, 13));
            expect(getCalendarTargetDate(day(2026, 11, 12), 'previousDay')).toEqual(day(2026, 11, 11));
        });

        it('should cross month and year edges by day', () => {
            expect(getCalendarTargetDate(day(2026, 11, 30), 'nextDay')).toEqual(day(2026, 12, 1));
            expect(getCalendarTargetDate(day(2026, 1, 1), 'previousDay')).toEqual(day(2025, 12, 31));
        });

        it('should move by one week and cross months', () => {
            expect(getCalendarTargetDate(day(2026, 11, 12), 'nextWeek')).toEqual(day(2026, 11, 19));
            expect(getCalendarTargetDate(day(2026, 11, 26), 'nextWeek')).toEqual(day(2026, 12, 3));
            expect(getCalendarTargetDate(day(2026, 11, 3), 'previousWeek')).toEqual(day(2026, 10, 27));
        });

        it('should keep the time of day of a day pick (00:00 UTC)', () => {
            const target = getCalendarTargetDate(new Date(2026, 10, 12, 15), 'nextDay') as Date;
            expect(target.getUTCHours()).toBe(0);
            expect(target.getDate()).toBe(13);
        });
    });

    describe('month and year moves', () => {
        it('should move to the same day number in the next or previous month', () => {
            expect(getCalendarTargetDate(day(2026, 11, 12), 'nextMonth')).toEqual(day(2026, 12, 12));
            expect(getCalendarTargetDate(day(2026, 1, 12), 'previousMonth')).toEqual(day(2025, 12, 12));
        });

        it('should clamp to the last day of the month', () => {
            expect(getCalendarTargetDate(day(2026, 1, 31), 'nextMonth')).toEqual(day(2026, 2, 28));
            expect(getCalendarTargetDate(day(2026, 3, 31), 'previousMonth')).toEqual(day(2026, 2, 28));
            expect(getCalendarTargetDate(day(2024, 1, 31), 'nextMonth')).toEqual(day(2024, 2, 29));
        });

        it('should move to the same day and month in the next or previous year', () => {
            expect(getCalendarTargetDate(day(2026, 11, 12), 'nextYear')).toEqual(day(2027, 11, 12));
            expect(getCalendarTargetDate(day(2026, 11, 12), 'previousYear')).toEqual(day(2025, 11, 12));
        });

        it('should clamp February 29 to the last day in a non-leap year', () => {
            expect(getCalendarTargetDate(day(2024, 2, 29), 'nextYear')).toEqual(day(2025, 2, 28));
            expect(getCalendarTargetDate(day(2024, 2, 29), 'previousYear')).toEqual(day(2023, 2, 28));
        });
    });

    describe('range limit', () => {
        it('should not move to a day out of the range', () => {
            const options = { minDate: day(2026, 11, 4), maxDate: day(2026, 11, 20) };
            expect(getCalendarTargetDate(day(2026, 11, 20), 'nextDay', options)).toBeUndefined();
            expect(getCalendarTargetDate(day(2026, 11, 4), 'previousDay', options)).toBeUndefined();
            // maxDate is Friday 20: Down on Tuesday 17 targets Tuesday 24 => no move (not clamped to the edge).
            expect(getCalendarTargetDate(day(2026, 11, 17), 'nextWeek', options)).toBeUndefined();
            expect(getCalendarTargetDate(day(2026, 11, 12), 'nextMonth', options)).toBeUndefined();
            expect(getCalendarTargetDate(day(2026, 11, 12), 'previousYear', options)).toBeUndefined();
        });

        it('should move to the range edges', () => {
            const options = { minDate: day(2026, 11, 4), maxDate: day(2026, 11, 20) };
            expect(getCalendarTargetDate(day(2026, 11, 19), 'nextDay', options)).toEqual(day(2026, 11, 20));
            expect(getCalendarTargetDate(day(2026, 11, 11), 'previousWeek', options)).toEqual(day(2026, 11, 4));
        });
    });

    describe('week row and month edge moves', () => {
        it('should move to the first and last day of the week row', () => {
            const date = day(2026, 11, 12);
            expect(getCalendarTargetDate(date, 'weekStart')).toEqual(day(2026, 11, 9));
            expect(getCalendarTargetDate(date, 'weekEnd')).toEqual(day(2026, 11, 15));
            expect(getCalendarTargetDate(date, 'weekStart', { weekStartDay: 0 })).toEqual(day(2026, 11, 8));
            expect(getCalendarTargetDate(date, 'weekEnd', { weekStartDay: 0 })).toEqual(day(2026, 11, 14));
        });

        it('should keep the week row in the month', () => {
            expect(getCalendarTargetDate(day(2026, 11, 1), 'weekStart')).toEqual(day(2026, 11, 1));
            expect(getCalendarTargetDate(day(2026, 11, 30), 'weekEnd')).toEqual(day(2026, 11, 30));
        });

        it('should move to the first and last day of the month', () => {
            const date = day(2026, 11, 12);
            expect(getCalendarTargetDate(date, 'monthStart')).toEqual(day(2026, 11, 1));
            expect(getCalendarTargetDate(date, 'monthEnd')).toEqual(day(2026, 11, 30));
        });

        it('should snap to the range', () => {
            const date = day(2026, 11, 12);
            const options = { minDate: day(2026, 11, 11), maxDate: day(2026, 11, 13) };
            expect(getCalendarTargetDate(date, 'weekStart', options)).toEqual(day(2026, 11, 11));
            expect(getCalendarTargetDate(date, 'weekEnd', options)).toEqual(day(2026, 11, 13));
            expect(getCalendarTargetDate(date, 'monthStart', options)).toEqual(day(2026, 11, 11));
            expect(getCalendarTargetDate(date, 'monthEnd', options)).toEqual(day(2026, 11, 13));
        });

        it('should leave the month when the whole month is out of the range', () => {
            const date = day(2026, 11, 12);
            expect(getCalendarTargetDate(date, 'monthStart', { minDate: day(2026, 12, 3) })).toEqual(day(2026, 12, 3));
            expect(getCalendarTargetDate(date, 'weekEnd', { maxDate: day(2026, 10, 20) })).toEqual(day(2026, 10, 20));
        });
    });
});
