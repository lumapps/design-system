import { shouldLoopListHorizontally } from './shouldLoopListHorizontally';

describe('shouldLoopListHorizontally', () => {
    it.each([
        {
            direction: 'horizontal',
            loopRow: 'inside',
        },
        {
            direction: 'both',
            loopRow: 'inside',
        },
        {
            direction: 'horizontal',
            loopRow: 'next-loop',
        },
        {
            direction: 'both',
            loopRow: 'next-loop',
        },
    ] as const)('should return true for direction %direction and loop.col = %loopRow', ({ direction, loopRow }) => {
        expect(shouldLoopListHorizontally(direction, { row: loopRow })).toBe(true);
    });

    it.each([
        {
            direction: 'vertical',
            loopRow: 'inside',
        },
        {
            direction: 'vertical',
            loopRow: 'next-loop',
        },
        {
            direction: 'vertical',
            loopRow: 'next-end',
        },
        {
            direction: 'horizontal',
            loopRow: 'next-end',
        },
        {
            direction: 'both',
            loopRow: 'next-end',
        },
    ] as const)('should return false for direction $direction and loop.col = $loopRow', ({ direction, loopRow }) => {
        expect(shouldLoopListHorizontally(direction, { row: loopRow })).toBe(false);
    });
});
