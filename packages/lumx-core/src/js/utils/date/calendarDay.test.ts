import { parseLocale } from '../locale/parseLocale';
import type { Locale } from '../locale/types';
import {
    addMonthResetDay,
    getCalendarDate,
    getDateKey,
    getDaysInMonth,
    isDateInRange,
    isDateValid,
    isSameDay,
    parseDateKey,
    snapDateToRange,
    toCalendarDate,
} from './calendarDay';
import { getMonthCalendar } from './getMonthCalendar';
import { describeInTimeZones } from '../../../testing/timeZones';

/** Local year, month index and day of a date. */
const localDay = (date: Date) => [date.getFullYear(), date.getMonth(), date.getDate()];

describeInTimeZones('calendarDay', ({ offset }) => {
    describe(isDateValid, () => {
        it('should check the date is valid', () => {
            expect(isDateValid(undefined)).toBe(false);
            expect(isDateValid(new Date('foo'))).toBe(false);
            expect(isDateValid(new Date())).toBe(true);
        });
    });

    describe(getCalendarDate, () => {
        it('should return the 00:00 UTC instant whose local date is the day', () => {
            const date = getCalendarDate(2026, 10, 12);
            expect(date.getUTCMinutes()).toBe(0);
            // 00:00 UTC of the day, or of the next day in a negative offset zone.
            expect(date.getUTCHours()).toBe(0);
            expect(date.getUTCDate()).toBe(offset > 0 ? 13 : 12);
            expect(localDay(date)).toEqual([2026, 10, 12]);
        });

        it('should overflow the day like the Date constructor', () => {
            expect(localDay(getCalendarDate(2026, 1, 29))).toEqual([2026, 2, 1]);
            expect(localDay(getCalendarDate(2026, 2, 0))).toEqual([2026, 1, 28]);
        });

        it('should not map two-digit years to 19xx', () => {
            expect(getCalendarDate(26, 0, 15).getFullYear()).toBe(26);
        });

        it('should give the same date as a day pick of the calendar grid', () => {
            const { weeks } = getMonthCalendar(parseLocale('fr') as Locale, new Date(2017, 1, 15, 18));
            const dayPicks = weeks
                .flatMap((week) => Object.values(week).map((day) => day?.date as Date))
                .sort((a, b) => a.getTime() - b.getTime());
            expect(dayPicks).toHaveLength(28);
            dayPicks.forEach((date, index) => expect(date).toEqual(getCalendarDate(2017, 1, index + 1)));
        });
    });

    describe(toCalendarDate, () => {
        it('should convert a date to the calendar date of its local day', () => {
            expect(toCalendarDate(new Date(2026, 10, 12, 0, 0))).toEqual(getCalendarDate(2026, 10, 12));
            expect(toCalendarDate(new Date(2026, 10, 12, 23, 59))).toEqual(getCalendarDate(2026, 10, 12));
        });
    });

    describe(isSameDay, () => {
        it('should compare the local days', () => {
            expect(isSameDay(new Date(2023, 7, 26, 0, 0), new Date(2023, 7, 26, 23, 59))).toBe(true);
            expect(isSameDay(new Date(2023, 7, 26, 23, 59), getCalendarDate(2023, 7, 26))).toBe(true);
            expect(isSameDay(new Date(2023, 7, 26), new Date(2023, 7, 27))).toBe(false);
            expect(isSameDay(new Date(2023, 7, 15), new Date(2023, 8, 15))).toBe(false);
            expect(isSameDay(new Date(2022, 11, 25), new Date(1923, 11, 25))).toBe(false);
        });

        it('should handle invalid date', () => {
            // Invalid dates are not comparable, so it is always `false`.
            expect(isSameDay(undefined as unknown as Date, undefined as unknown as Date)).toBe(false);
            expect(isSameDay(null as unknown as Date, new Date())).toBe(false);
            expect(isSameDay(new Date('-'), new Date('-'))).toBe(false);
        });
    });

    describe(isDateInRange, () => {
        it('should accept any date without a range', () => {
            expect(isDateInRange(getCalendarDate(1990, 0, 1))).toBe(true);
        });

        it('should include the range edges', () => {
            const minDate = getCalendarDate(2026, 10, 4);
            const maxDate = getCalendarDate(2026, 10, 24);
            expect(isDateInRange(getCalendarDate(2026, 10, 4), minDate, maxDate)).toBe(true);
            expect(isDateInRange(getCalendarDate(2026, 10, 24), minDate, maxDate)).toBe(true);
        });

        it('should reject the days out of the range', () => {
            const minDate = getCalendarDate(2026, 10, 4);
            const maxDate = getCalendarDate(2026, 10, 24);
            expect(isDateInRange(getCalendarDate(2026, 10, 3), minDate, maxDate)).toBe(false);
            expect(isDateInRange(getCalendarDate(2026, 10, 25), minDate, maxDate)).toBe(false);
        });

        it('should compare the local days of range edges with a time of day', () => {
            const minDate = new Date(2026, 10, 4, 0, 0);
            const maxDate = new Date(2026, 10, 24, 23, 59);
            expect(isDateInRange(getCalendarDate(2026, 10, 3), minDate, maxDate)).toBe(false);
            expect(isDateInRange(getCalendarDate(2026, 10, 4), minDate, maxDate)).toBe(true);
            expect(isDateInRange(getCalendarDate(2026, 10, 24), minDate, maxDate)).toBe(true);
            expect(isDateInRange(getCalendarDate(2026, 10, 25), minDate, maxDate)).toBe(false);
            // Not the time of day.
            expect(isDateInRange(new Date(2026, 10, 4, 0, 0), new Date(2026, 10, 4, 18))).toBe(true);
        });
    });

    describe(snapDateToRange, () => {
        it('should keep a date in the range', () => {
            const date = getCalendarDate(2026, 10, 12);
            expect(snapDateToRange(date, getCalendarDate(2026, 10, 4), getCalendarDate(2026, 10, 24))).toBe(date);
        });

        it('should snap to the calendar date of the range edges', () => {
            const minDate = getCalendarDate(2026, 10, 4);
            const maxDate = getCalendarDate(2026, 10, 24);
            expect(snapDateToRange(getCalendarDate(2025, 0, 1), minDate, maxDate)).toEqual(minDate);
            expect(snapDateToRange(getCalendarDate(2027, 0, 1), minDate, maxDate)).toEqual(maxDate);
        });

        it('should snap to the calendar date of the local day of range edges with a time of day', () => {
            const minDate = new Date(2026, 10, 4, 0, 0);
            const maxDate = new Date(2026, 10, 24, 23, 59);
            expect(snapDateToRange(getCalendarDate(2025, 0, 1), minDate, maxDate)).toEqual(
                getCalendarDate(2026, 10, 4),
            );
            expect(snapDateToRange(getCalendarDate(2027, 0, 1), minDate, maxDate)).toEqual(
                getCalendarDate(2026, 10, 24),
            );
        });
    });

    describe(getDateKey, () => {
        it('should format the local day as YYYY-MM-DD', () => {
            expect(getDateKey(new Date(2026, 10, 2, 0, 0))).toBe('2026-11-02');
            expect(getDateKey(new Date(2026, 10, 2, 23, 59))).toBe('2026-11-02');
            expect(getDateKey(getCalendarDate(987, 0, 5))).toBe('0987-01-05');
        });
    });

    describe(parseDateKey, () => {
        it('should parse a key to its calendar date', () => {
            expect(parseDateKey('2026-11-02')).toEqual(getCalendarDate(2026, 10, 2));
            expect(getDateKey(parseDateKey('2026-11-02') as Date)).toBe('2026-11-02');
        });

        it('should reject invalid keys', () => {
            expect(parseDateKey(undefined)).toBeUndefined();
            expect(parseDateKey('2026-02-30')).toBeUndefined();
            expect(parseDateKey('2026-1-2')).toBeUndefined();
        });
    });

    describe(getDaysInMonth, () => {
        it('should count the days of a month', () => {
            expect(getDaysInMonth(2026, 0)).toBe(31);
            expect(getDaysInMonth(2026, 1)).toBe(28);
            expect(getDaysInMonth(2024, 1)).toBe(29);
            expect(getDaysInMonth(2026, 10)).toBe(30);
        });
    });

    describe(addMonthResetDay, () => {
        it('should add months on the first day of the month', () => {
            expect(addMonthResetDay(new Date(2017, 0, 30, 10), 1)).toEqual(new Date(2017, 1, 1, 10));
        });

        it('should remove months on the first day of the month', () => {
            expect(addMonthResetDay(new Date(2017, 0, 30, 10), -2)).toEqual(new Date(2016, 10, 1, 10));
        });

        it('should keep the local month of a calendar date', () => {
            expect(localDay(addMonthResetDay(getCalendarDate(2017, 0, 31), 1))).toEqual([2017, 1, 1]);
        });
    });
});
