import { getCalendarDate } from '../../utils/date/calendarDay';
import { getRovingDate } from './getRovingDate';
import { describeInTimeZones } from '../../../testing/timeZones';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

describeInTimeZones('getRovingDate', () => {
    /** Today, with a local time of day (made in the time zone of the test). */
    let today: Date;
    beforeEach(() => {
        today = new Date(2026, 10, 12, 15, 30);
    });

    describe('on open', () => {
        it('should use the selected date', () => {
            expect(getRovingDate({ month: day(2026, 11, 1), value: day(2026, 11, 20), today })).toEqual(
                day(2026, 11, 20),
            );
        });

        it('should use today without a selected date', () => {
            expect(getRovingDate({ month: day(2026, 11, 1), today })).toEqual(day(2026, 11, 12));
        });

        it('should limit to the range', () => {
            const options = { month: day(2026, 11, 1), today };
            expect(getRovingDate({ ...options, minDate: day(2026, 11, 15) })).toEqual(day(2026, 11, 15));
            expect(getRovingDate({ ...options, maxDate: day(2026, 11, 5) })).toEqual(day(2026, 11, 5));
        });

        it('should use the same day number in another shown month (default month)', () => {
            expect(getRovingDate({ month: day(2019, 7, 14), today })).toEqual(day(2019, 7, 12));
        });
    });

    describe('after a month change', () => {
        it('should move to the same day number in the new month', () => {
            const rovingDate = day(2026, 11, 20);
            expect(getRovingDate({ month: day(2026, 12, 1), rovingDate, today })).toEqual(day(2026, 12, 20));
        });

        it('should move to the last day when the day does not exist', () => {
            const rovingDate = day(2026, 1, 31);
            expect(getRovingDate({ month: day(2026, 2, 1), rovingDate, today })).toEqual(day(2026, 2, 28));
        });

        it('should prefer the roving date over the selected date', () => {
            const options = { month: day(2026, 11, 1), value: day(2026, 11, 3), today };
            expect(getRovingDate({ ...options, rovingDate: day(2026, 11, 25) })).toEqual(day(2026, 11, 25));
        });

        it('should limit to the range', () => {
            const options = { month: day(2026, 12, 1), rovingDate: day(2026, 11, 20), today };
            expect(getRovingDate({ ...options, maxDate: day(2026, 12, 10) })).toEqual(day(2026, 12, 10));
        });

        it('should return undefined when no day of the month is in the range', () => {
            const options = { month: day(2026, 12, 1), rovingDate: day(2026, 11, 20), today };
            expect(getRovingDate({ ...options, maxDate: day(2026, 11, 30) })).toBeUndefined();
        });
    });
});
