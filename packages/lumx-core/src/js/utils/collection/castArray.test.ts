import { castArray } from '@lumx/core/js/utils/collection/castArray';

describe(castArray, () => {
    it('should keep existing array', () => {
        const input = [1, 2];
        const output = castArray(input);
        expect(output).toEqual([1, 2]);
        expect(output).toBe(input);
    });
    it('should cast item to array', () => {
        const input = 1;
        const output = castArray(input);
        expect(output).toEqual([1]);
    });
});
