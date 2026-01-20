import find from 'lodash/find';
import findLast from 'lodash/findLast';

import { CELL_SEARCH_DIRECTION } from '../constants';
import { CellSelector, CoordsType, DirectionCoords, GridMap, TabStop } from '../types';

import { tabStopIsEnabled } from './tabStopIsEnabled';

/**
 * Check that the given coordinate is a simple number
 */
const isNumberCoords = (coords: CoordsType): coords is number => typeof coords === 'number';

/**
 * Check that the given coordinate is a direction
 */
function isDirectionCoords(coords: CoordsType): coords is DirectionCoords {
    return Boolean(typeof coords !== 'number' && typeof coords?.from === 'number');
}

/**
 * Search the given column of a grid map for a cell.
 */
function findCellInCol(
    gridMap: GridMap,
    col: number,
    rowCoords: DirectionCoords,
    cellSelector: CellSelector = tabStopIsEnabled,
) {
    /** The rowIndex might not be strictly successive, so we need to use the actual row index keys. */
    const { rowKeys, tabStopsByRowKey } = gridMap;
    const lastIndex = rowKeys.length - 1;
    /**
     * If the rowCoords.from is set at -1, it means we should search from the start/end.
     */
    let searchIndex = rowCoords.from;
    if (searchIndex === -1) {
        searchIndex = rowCoords.direction === CELL_SEARCH_DIRECTION.desc ? lastIndex : 0;
    }

    const searchCellFunc = rowCoords.direction === CELL_SEARCH_DIRECTION.desc ? findLast : find;
    const rowKeyWithEnabledCell = searchCellFunc(rowKeys, (rowKey, index) => {
        const row = tabStopsByRowKey[rowKey];
        const cell = row[col];
        const hasCell = Boolean(cell);
        const cellRowIndex = index;

        /** Check that the target row index is in the right direction of the search  */
        const correctRowIndex =
            rowCoords.direction === CELL_SEARCH_DIRECTION.desc
                ? cellRowIndex <= searchIndex
                : cellRowIndex >= searchIndex;

        if (cell && correctRowIndex) {
            return cellSelector ? hasCell && cellSelector(cell) : hasCell;
        }
        return false;
    });
    const row = rowKeyWithEnabledCell !== undefined ? tabStopsByRowKey[rowKeyWithEnabledCell] : undefined;
    return row?.[col];
}

/**
 * Search the given column of a grid map for a cell.
 */
function findCellInRow(
    gridMap: GridMap,
    row: number,
    colCoords: DirectionCoords,
    cellSelector: CellSelector = tabStopIsEnabled,
) {
    const { direction, from } = colCoords || {};
    const { rowKeys, tabStopsByRowKey } = gridMap;
    const rowKey = rowKeys[row];
    const currentRow = tabStopsByRowKey[rowKey];
    if (!currentRow) {
        return undefined;
    }

    const searchCellFunc = direction === CELL_SEARCH_DIRECTION.desc ? findLast : find;
    const cell = searchCellFunc(currentRow, cellSelector, from);
    return cell;
}

/**
 * Parse each column of the given gridMap to find the first cell matching the selector.
 * The direction and starting point of the search can be set using the coordinates attribute.
 */
function parseColsForCell(
    /** The gridMap to search */
    gridMap: GridMap,
    /** The coordinate to search */
    { direction = CELL_SEARCH_DIRECTION.asc, from }: DirectionCoords,
    cellSelector: CellSelector = tabStopIsEnabled,
) {
    if (from === undefined) {
        return undefined;
    }

    const { rowKeys, tabStopsByRowKey } = gridMap;

    /** As we cannot know for certain when to stop, we need to know which column is the last column */
    const maxColIndex = rowKeys.reduce<number>((maxLength, rowIndex) => {
        const rowLength = tabStopsByRowKey[rowIndex].length;
        return rowLength > maxLength ? rowLength - 1 : maxLength;
    }, 0);

    /** If "from" is set as -1, start from the end. */
    const fromIndex = from === -1 ? maxColIndex : from || 0;

    for (
        let index = fromIndex;
        direction === CELL_SEARCH_DIRECTION.desc ? index > -1 : index <= maxColIndex;
        direction === CELL_SEARCH_DIRECTION.desc ? (index -= 1) : (index += 1)
    ) {
        const rowWithEnabledCed = findCellInCol(
            gridMap,
            index,
            { direction, from: direction === CELL_SEARCH_DIRECTION.desc ? -1 : 0 },
            cellSelector,
        );

        if (rowWithEnabledCed) {
            return rowWithEnabledCed;
        }
    }

    return undefined;
}

/**
 * Search for a cell in a gridMap
 *
 * This allows you to
 * * Select a cell at a specific coordinate
 * * Search for a cell from a specific column in any direction
 * * Search for a cell from a specific row in any direction
 *
 * If no cell is found, returns undefined
 */
export function getCell(
    /** The gridMap object to search in. */
    gridMap: GridMap,
    /** The coordinates of the cell to select */
    coords: {
        /** The row on or from witch to look for */
        row: CoordsType;
        /** The column on or from witch to look for */
        col: CoordsType;
    },
    /**
     * A selector function to select the cell.
     * Selects enabled cells by default.
     */
    cellSelector: CellSelector = tabStopIsEnabled,
): TabStop | undefined {
    const { row, col } = coords || {};
    const { rowKeys, tabStopsByRowKey } = gridMap || {};

    /** Defined row and col */
    if (isNumberCoords(row) && isNumberCoords(col)) {
        const rowKey = rowKeys[row];
        return tabStopsByRowKey[rowKey][col];
    }

    /** Defined row but variable col */
    if (isDirectionCoords(col) && isNumberCoords(row)) {
        return findCellInRow(gridMap, row, col, cellSelector);
    }

    if (isDirectionCoords(row)) {
        if (isDirectionCoords(col)) {
            return parseColsForCell(gridMap, col, cellSelector);
        }
        return findCellInCol(gridMap, col, row, cellSelector);
    }

    return undefined;
}
