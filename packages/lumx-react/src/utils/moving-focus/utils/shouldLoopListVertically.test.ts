import { shouldLoopListVertically } from './shouldLoopListVertically';

describe('shouldLoopListVertically', () => {
    it.each([
        {
            direction: 'vertical',
            loopCol: 'inside',
        },
        {
            direction: 'both',
            loopCol: 'inside',
        },
        {
            direction: 'vertical',
            loopCol: 'next-loop',
        },
        {
            direction: 'both',
            loopCol: 'next-loop',
        },
    ] as const)('should return true for direction %direction and loop.col = %loopCol', ({ direction, loopCol }) => {
        expect(shouldLoopListVertically(direction, { col: loopCol })).toBe(true);
    });

    it.each([
        {
            direction: 'horizontal',
            loopCol: 'inside',
        },
        {
            direction: 'horizontal',
            loopCol: 'next-loop',
        },
        {
            direction: 'horizontal',
            loopCol: 'next-end',
        },
        {
            direction: 'vertical',
            loopCol: 'next-end',
        },
        {
            direction: 'both',
            loopCol: 'next-end',
        },
    ] as const)('should return false for direction $direction and loop.col = $loopCol', ({ direction, loopCol }) => {
        expect(shouldLoopListVertically(direction, { col: loopCol })).toBe(false);
    });
});
