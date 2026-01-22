import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';

import { GridMap, TabStop, TabStopRowKey } from '../types';

/**
 * Create a map from the given tab stop to sort them by rowKey;
 */
export function createGridMap(tabStops: readonly TabStop[]): GridMap {
    /** Group all tabStop by rows to easily access them by their row keys */
    const tabStopsByRowKey = groupBy(tabStops, 'rowKey');
    /**
     * An array with each row key in the order set in the tabStops array.
     * Each rowKey will only appear once.
     */
    const rowKeys = tabStops.reduce<TabStopRowKey[]>((acc, { rowKey }) => {
        if (!isNil(rowKey) && !acc.includes(rowKey)) {
            return [...acc, rowKey];
        }
        return acc;
    }, []);

    return {
        tabStopsByRowKey,
        rowKeys,
    };
}
