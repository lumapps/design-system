import { chunk } from '@lumx/react/utils/collection/chunk';

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
});
