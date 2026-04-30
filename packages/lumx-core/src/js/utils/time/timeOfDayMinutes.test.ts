import { timeOfDayMinutes } from './timeOfDayMinutes';

describe(timeOfDayMinutes, () => {
    it('returns 0 for midnight', () => {
        expect(timeOfDayMinutes(new Date(2024, 0, 15, 0, 0))).toBe(0);
    });

    it('returns 870 for 14:30', () => {
        expect(timeOfDayMinutes(new Date(2024, 0, 15, 14, 30))).toBe(14 * 60 + 30);
    });

    it('returns 1439 for 23:59', () => {
        expect(timeOfDayMinutes(new Date(2024, 0, 15, 23, 59))).toBe(1439);
    });
});
