import { snapTimeToBounds } from './snapTimeToBounds';
import { getDateAtTime } from './getDateAtTime';

describe(snapTimeToBounds, () => {
    it('returns the input unchanged when no bounds are provided', () => {
        const time = { hour: 14, minute: 30 };
        expect(snapTimeToBounds(time)).toBe(time);
    });

    it('returns the input unchanged when within bounds', () => {
        const time = { hour: 14, minute: 30 };
        expect(
            snapTimeToBounds(time, {
                minTime: getDateAtTime({ hour: 8, minute: 0 }),
                maxTime: getDateAtTime({ hour: 18, minute: 0 }),
            }),
        ).toBe(time);
    });

    it('snaps up to `minTime` when input is below it', () => {
        const time = { hour: 6, minute: 0 };
        expect(snapTimeToBounds(time, { minTime: getDateAtTime({ hour: 8, minute: 30 }) })).toEqual({
            hour: 8,
            minute: 30,
        });
    });

    it('snaps down to `maxTime` when input is above it', () => {
        const time = { hour: 22, minute: 0 };
        expect(snapTimeToBounds(time, { maxTime: getDateAtTime({ hour: 18, minute: 15 }) })).toEqual({
            hour: 18,
            minute: 15,
        });
    });

    it('keeps the input when it equals a bound', () => {
        const time = { hour: 8, minute: 0 };
        expect(
            snapTimeToBounds(time, {
                minTime: getDateAtTime({ hour: 8, minute: 0 }),
                maxTime: getDateAtTime({ hour: 18, minute: 0 }),
            }),
        ).toBe(time);
    });

    it('ignores the date part of the bounds', () => {
        const time = { hour: 6, minute: 0 };
        const oldDate = new Date(2000, 0, 1, 9, 0, 0, 0);
        expect(snapTimeToBounds(time, { minTime: oldDate })).toEqual({ hour: 9, minute: 0 });
    });

    describe('minDateTime / maxDateTime', () => {
        it('snaps up to `minDateTime` when combined date-time is below it', () => {
            const value = new Date(2024, 5, 15, 14, 0);
            const minDateTime = new Date(2024, 5, 15, 12, 0);
            const time = { hour: 9, minute: 0 };
            expect(snapTimeToBounds(time, { minDateTime, value })).toEqual({ hour: 12, minute: 0 });
        });

        it('snaps down to `maxDateTime` when combined date-time is above it', () => {
            const value = new Date(2024, 5, 15, 11, 0);
            const maxDateTime = new Date(2024, 5, 15, 14, 0);
            const time = { hour: 18, minute: 0 };
            expect(snapTimeToBounds(time, { maxDateTime, value })).toEqual({ hour: 14, minute: 0 });
        });

        it('does not snap `minDateTime` when value date is later', () => {
            const value = new Date(2024, 6, 15, 11, 0);
            const minDateTime = new Date(2024, 5, 15, 12, 0);
            const time = { hour: 9, minute: 0 };
            expect(snapTimeToBounds(time, { minDateTime, value })).toBe(time);
        });

        it('skips dateTime bounds when value is undefined', () => {
            const minDateTime = new Date(2024, 5, 15, 12, 0);
            const time = { hour: 6, minute: 0 };
            expect(snapTimeToBounds(time, { minDateTime })).toBe(time);
        });
    });
});
