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
            snapTimeToBounds(time, getDateAtTime({ hour: 8, minute: 0 }), getDateAtTime({ hour: 18, minute: 0 })),
        ).toBe(time);
    });

    it('snaps up to `minTime` when input is below it', () => {
        const time = { hour: 6, minute: 0 };
        expect(snapTimeToBounds(time, getDateAtTime({ hour: 8, minute: 30 }))).toEqual({ hour: 8, minute: 30 });
    });

    it('snaps down to `maxTime` when input is above it', () => {
        const time = { hour: 22, minute: 0 };
        expect(snapTimeToBounds(time, undefined, getDateAtTime({ hour: 18, minute: 15 }))).toEqual({
            hour: 18,
            minute: 15,
        });
    });

    it('keeps the input when it equals a bound', () => {
        const time = { hour: 8, minute: 0 };
        expect(
            snapTimeToBounds(time, getDateAtTime({ hour: 8, minute: 0 }), getDateAtTime({ hour: 18, minute: 0 })),
        ).toBe(time);
    });

    it('ignores the date part of the bounds', () => {
        const time = { hour: 6, minute: 0 };
        // minTime "20 days ago" at 09:00 — only the time-of-day matters.
        const oldDate = new Date(2000, 0, 1, 9, 0, 0, 0);
        expect(snapTimeToBounds(time, oldDate)).toEqual({ hour: 9, minute: 0 });
    });
});
