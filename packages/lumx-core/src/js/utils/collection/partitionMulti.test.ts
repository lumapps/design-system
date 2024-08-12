import { partitionMulti } from './partitionMulti';

describe('partitionMulti', () => {
    it('should partition with single predicate', () => {
        const data = [0, 1, 2, 3, 4, 5];
        const isEven = (n: number): boolean => n % 2 === 0;

        const actual = partitionMulti(data, [isEven]);

        expect(actual).toEqual([
            [0, 2, 4],
            [1, 3, 5],
        ]);
    });

    it('should partition on multiple predicates', () => {
        type T = string | number | boolean;
        const data: T[] = ['a', 1, 'b', false, true];
        const isString = (s: T): boolean => typeof s === 'string';
        const isNumber = (s: T): boolean => typeof s === 'number';
        const isNull = (s: T): boolean => s === null;

        const partitions = partitionMulti(data, [isString, isNumber, isNull]);
        expect(partitions).toEqual([
            // strings
            ['a', 'b'],
            // numbers
            [1],
            // nulls
            [],
            // others
            [false, true],
        ]);
    });
});
