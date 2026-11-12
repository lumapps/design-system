import { getCalendarDate } from './calendarDay';
import { getCalendarTargetDate } from './getCalendarTargetDate';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

describe(getCalendarTargetDate, () => {
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
            const target = getCalendarTargetDate(new Date(2026, 2, 28, 15), 'nextDay') as Date;
            expect(target.getUTCHours()).toBe(0);
            expect(target.getDate()).toBe(29);
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
        const options = { minDate: day(2026, 11, 4), maxDate: day(2026, 11, 20) };

        it('should not move to a day out of the range', () => {
            expect(getCalendarTargetDate(day(2026, 11, 20), 'nextDay', options)).toBeUndefined();
            expect(getCalendarTargetDate(day(2026, 11, 4), 'previousDay', options)).toBeUndefined();
            // maxDate is Friday 20: Down on Tuesday 17 targets Tuesday 24 => no move (not clamped to the edge).
            expect(getCalendarTargetDate(day(2026, 11, 17), 'nextWeek', options)).toBeUndefined();
            expect(getCalendarTargetDate(day(2026, 11, 12), 'nextMonth', options)).toBeUndefined();
            expect(getCalendarTargetDate(day(2026, 11, 12), 'previousYear', options)).toBeUndefined();
        });

        it('should move to the range edges', () => {
            expect(getCalendarTargetDate(day(2026, 11, 19), 'nextDay', options)).toEqual(day(2026, 11, 20));
            expect(getCalendarTargetDate(day(2026, 11, 11), 'previousWeek', options)).toEqual(day(2026, 11, 4));
        });
    });
});
