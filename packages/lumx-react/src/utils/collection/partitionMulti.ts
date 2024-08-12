import type { Predicate } from '../type';

/**
 * Similar to lodash `partition` function but working with multiple predicates.
 *
 * @example
 * const isString = (s) => typeof s === 'string'
 * const isNumber = (s) => typeof s === 'number'
 * const [strings, numbers, others] = partitionMulti(['a', 1, 'b', false], [isString, isNumber])
 * //=> [['a', 'b'], [1], [false]]
 *
 * @param  elements array of elements
 * @param  predicates array of predicates to apply on elements
 * @return partitioned elements by the given predicates
 */
export function partitionMulti<T>(elements: T[], predicates: Array<Predicate<T>>): T[][] {
    const others = [] as T[];
    const groups = predicates.map(() => []) as T[][];

    for (const element of elements) {
        const index = predicates.findIndex((predicate) => predicate(element));
        if (index !== -1) {
            groups[index].push(element);
        } else {
            others.push(element);
        }
    }
    return [...groups, others];
}
