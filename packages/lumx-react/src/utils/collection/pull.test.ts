import { pull } from '@lumx/react/utils/collection/pull';

describe(pull, () => {
    it('should do nothing if element does not exist', () => {
        const a = [1, 2];
        pull(a, 0);
        expect(a).toBe(a);
        expect(a).toEqual([1, 2]);
    });

    it('should pull an element from the array', () => {
        const a = [1, 2];
        pull(a, 1);
        expect(a).toBe(a);
        expect(a).toEqual([2]);
    });
});
