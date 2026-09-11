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
        expect(snapTimeToBounds(time, undefined, getDateAtTime({ hour: 18, minute: 0 }))).toEqual({
            hour: 18,
            minute: 0,
        });
    });

    it('keeps the input when it equals a grid-aligned bound', () => {
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

    it('snaps up to the next on-grid option when `minTime` is not step-aligned', () => {
        const time = { hour: 9, minute: 0 };
        expect(snapTimeToBounds(time, getDateAtTime({ hour: 10, minute: 5 }))).toEqual({
            hour: 10,
            minute: 30,
        });
    });

    it('snaps down to the last on-grid option when `maxTime` is not step-aligned', () => {
        const time = { hour: 11, minute: 0 };
        expect(snapTimeToBounds(time, undefined, getDateAtTime({ hour: 10, minute: 5 }))).toEqual({
            hour: 10,
            minute: 0,
        });
    });

    it('snaps a value equal to a non-step-aligned `minTime` up to the next on-grid option', () => {
        const time = { hour: 10, minute: 5 };
        expect(snapTimeToBounds(time, getDateAtTime({ hour: 10, minute: 5 }))).toEqual({
            hour: 10,
            minute: 30,
        });
    });

    it('does not change behavior when the bound already sits on the grid', () => {
        const time = { hour: 7, minute: 0 };
        expect(snapTimeToBounds(time, getDateAtTime({ hour: 8, minute: 0 }))).toEqual({ hour: 8, minute: 0 });
    });

    it('keeps the value unchanged when no on-grid option exists at/after `minTime`', () => {
        const time = { hour: 23, minute: 50 };
        expect(snapTimeToBounds(time, getDateAtTime({ hour: 23, minute: 45 }))).toBe(time);
    });

    it('keeps the value unchanged when `minTime` and `maxTime` leave no on-grid option between them', () => {
        const time = { hour: 10, minute: 10 };
        expect(
            snapTimeToBounds(time, getDateAtTime({ hour: 10, minute: 5 }), getDateAtTime({ hour: 10, minute: 20 })),
        ).toBe(time);
    });
});
