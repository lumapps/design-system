import isNil from 'lodash/isNil';

import { GridMap, TabStop } from '../types';

export function getCellCoordinates(gridMap: GridMap, tabStop: TabStop) {
    const currentRowKey = tabStop.rowKey;
    if (isNil(currentRowKey)) {
        return undefined;
    }
    const { rowKeys, tabStopsByRowKey } = gridMap;
    const rowIndex = rowKeys.findIndex((rowKey) => rowKey === currentRowKey);
    const row = tabStopsByRowKey[currentRowKey];
    const columnOffset = row.findIndex((ts) => ts.id === tabStop.id);

    return {
        rowIndex,
        row,
        columnOffset,
    };
}
