import { getWithSelector } from './getWithSelector';
import { Selector } from '../../types';

/**
 * Equivalent to `lodash/groupBy` but returns a `Map` of groups items (instead of an object)
 * (has the major advantage to not forcing the keys to be string!)
 */
export function groupBySelector<TObject, TValue>(
    array: TObject[],
    selector: Selector<TObject, TValue>,
): Map<TValue, TObject[]> {
    const groups = new Map<TValue, TObject[]>();

    for (const item of array) {
        const key = getWithSelector(selector, item);
        let group = groups.get(key);
        if (!group) {
            group = [];
            groups.set(key, group);
        }
        group.push(item);
    }

    return groups;
}
