import concat from 'lodash/concat';
import dropRight from 'lodash/dropRight';
import last from 'lodash/last';
import partition from 'lodash/partition';
import reduce from 'lodash/reduce';
import { Predicate } from './type';

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
    return reduce(
        predicates,
        (partitioned: T[][], predicate: Predicate<T>) =>
            concat(dropRight(partitioned), partition(last(partitioned), predicate)),
        [elements],
    );
}
