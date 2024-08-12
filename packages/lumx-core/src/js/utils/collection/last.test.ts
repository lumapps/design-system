import { last } from '@lumx/core/js/utils/collection/last';

describe(last, () => {
    it('should return undefined for empty array', () => {
        const input: number[] = [];
        const output = last(input);
        expect(output).toBeUndefined();
    });

    it('should return last element from array with single element', () => {
        const input = [42];
        const output = last(input);
        expect(output).toBe(42);
    });

    it('should return last element from array with multiple elements', () => {
        const input = [1, 2, 3, 4, 5];
        const output = last(input);
        expect(output).toBe(5);
    });
});
