import { getDateAtTime } from './getDateAtTime';

describe(getDateAtTime, () => {
    it('preserves the date part of the reference', () => {
        const reference = new Date(2024, 5, 15, 8, 30, 45, 123);
        const result = getDateAtTime({ hour: 14, minute: 30 }, reference);
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(5);
        expect(result.getDate()).toBe(15);
    });

    it('sets the requested hour and minute', () => {
        const reference = new Date(2024, 5, 15);
        const result = getDateAtTime({ hour: 14, minute: 30 }, reference);
        expect(result.getHours()).toBe(14);
        expect(result.getMinutes()).toBe(30);
    });

    it('zeroes seconds and milliseconds', () => {
        const reference = new Date(2024, 5, 15, 8, 30, 45, 123);
        const result = getDateAtTime({ hour: 14, minute: 30 }, reference);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it('does not mutate the reference', () => {
        const reference = new Date(2024, 5, 15, 8, 30);
        getDateAtTime({ hour: 14, minute: 30 }, reference);
        expect(reference.getHours()).toBe(8);
        expect(reference.getMinutes()).toBe(30);
    });

    it('falls back to today when no reference is provided', () => {
        const today = new Date();
        const result = getDateAtTime({ hour: 14, minute: 30 });
        expect(result.getFullYear()).toBe(today.getFullYear());
        expect(result.getMonth()).toBe(today.getMonth());
        expect(result.getDate()).toBe(today.getDate());
        expect(result.getHours()).toBe(14);
        expect(result.getMinutes()).toBe(30);
    });
});
