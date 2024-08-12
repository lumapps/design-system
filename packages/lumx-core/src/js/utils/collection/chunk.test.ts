import { chunk } from '@lumx/core/js/utils/collection/chunk';

describe(chunk, () => {
    it('should do nothing on empty array', () => {
        expect(chunk([], 2)).toEqual([]);
    });

    it('should work with size larger than input array', () => {
        expect(chunk([1, 2], 4)).toEqual([[1, 2]]);
    });

    it('should chunk array with size not perfectly dividing the array length', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should chunk array with size perfectly dividing the array length', () => {
        expect(chunk([1, 2, 3, 4], 2)).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    it('should work with size of 1', () => {
        expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should work with size equal to array length', () => {
        expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it('should throw error when size is 0', () => {
        expect(() => chunk([1, 2, 3], 0)).toThrow('Size must be greater than 0');
    });

    it('should throw error when size is negative', () => {
        expect(() => chunk([1, 2, 3], -1)).toThrow('Size must be greater than 0');
    });
});
