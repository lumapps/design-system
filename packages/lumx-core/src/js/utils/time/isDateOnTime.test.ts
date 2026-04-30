import { isDateOnTime } from './isDateOnTime';

describe(isDateOnTime, () => {
    it('returns true when hour and minute match', () => {
        expect(isDateOnTime(new Date(2024, 0, 1, 14, 30, 45, 123), { hour: 14, minute: 30 })).toBe(true);
    });

    it('returns false when hour differs', () => {
        expect(isDateOnTime(new Date(2024, 0, 1, 13, 30), { hour: 14, minute: 30 })).toBe(false);
    });

    it('returns false when minute differs', () => {
        expect(isDateOnTime(new Date(2024, 0, 1, 14, 0), { hour: 14, minute: 30 })).toBe(false);
    });

    it('ignores seconds and milliseconds', () => {
        expect(isDateOnTime(new Date(2024, 0, 1, 14, 30, 59, 999), { hour: 14, minute: 30 })).toBe(true);
    });
});
