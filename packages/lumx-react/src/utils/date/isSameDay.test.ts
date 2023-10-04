import { isSameDay } from '@lumx/react/utils/date/isSameDay';

describe(isSameDay, () => {
    it('should return true for same dates', () => {
        const date1 = new Date('2023-08-26T12:00:00');
        const date2 = new Date('2023-08-26T15:30:00');
        expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
        const date1 = new Date('2023-08-26T10:00:00');
        const date2 = new Date('2023-08-27T10:00:00');
        expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should handle different months', () => {
        const date1 = new Date('2023-08-15T08:00:00');
        const date2 = new Date('2023-09-15T08:00:00');
        expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should handle different years', () => {
        const date1 = new Date('2022-12-25T18:30:00');
        const date2 = new Date('1923-12-25T18:30:00');
        expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should handle invalid date', () => {
        // Invalid date input are not comparable, so we always return `false`
        // Undefined date
        expect(isSameDay(undefined as any, undefined as any)).toBe(false);
        // Null date
        expect(isSameDay(null as any, new Date())).toBe(false);
        // Invalid date
        expect(isSameDay(new Date('-'), new Date('-'))).toBe(false);
    });
});
