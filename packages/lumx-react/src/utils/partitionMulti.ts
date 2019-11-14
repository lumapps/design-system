import { Predicate } from './type';
import reduce from 'lodash/reduce';
import concat from 'lodash/concat';
import dropRight from 'lodash/dropRight';
import partition from 'lodash/partition';
import last from 'lodash/last';

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
function partitionMulti<T>(elements: T[], predicates: Array<Predicate<T>>): T[][] {
    return reduce(
        predicates,
        (partitioned: T[][], predicate: Predicate<T>) =>
            concat(dropRight(partitioned), partition(last(partitioned), predicate)),
        [elements],
    );
}

export { partitionMulti };
