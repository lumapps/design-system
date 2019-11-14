import partition from 'lodash/partition';
import { partitionMulti } from './';

describe(`partitionMulti`, (): void => {
    it('should act like partition for single predicate', (): void => {
        const data = [0, 1, 2, 3, 4, 5];
        const isEven = (n: number): boolean => n % 2 === 0;

        const expected = partition(data, isEven);
        const actual = partitionMulti(data, [isEven]);

        expect(actual).toEqual(expected);
    });

    it('should partition on multiple predicates', (): void => {
        type T = string | number | boolean;
        const data: T[] = ['a', 1, 'b', false, true];
        const isString = (s: T): boolean => typeof s === 'string';
        const isNumber = (s: T): boolean => typeof s === 'number';

        const [strings, numbers, others] = partitionMulti(data, [isString, isNumber]);

        expect(strings).toEqual(['a', 'b']);
        expect(numbers).toEqual([1]);
        expect(others).toEqual([false, true]);
    });
});
