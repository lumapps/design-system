import find from 'lodash/find';
import findLast from 'lodash/findLast';
import findLastIndex from 'lodash/findLastIndex';
import isNil from 'lodash/isNil';

import { LOOP_AROUND_TYPES } from '../constants';
import { KeyDirection, KeyNavAction, Navigation, Reducer, State, TabStop } from '../types';
import {
    createGridMap,
    getCell,
    getCellCoordinates,
    shouldLoopListHorizontally,
    shouldLoopListVertically,
    tabStopIsEnabled,
} from '../utils';

// Event keys used for keyboard navigation.
export const VERTICAL_NAV_KEYS = ['ArrowUp', 'ArrowDown', 'Home', 'End'] as const;
export const HORIZONTAL_NAV_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'] as const;
export const KEY_NAV_KEYS = [...HORIZONTAL_NAV_KEYS, ...VERTICAL_NAV_KEYS] as const;
export const NAV_KEYS: { [direction in KeyDirection]: ReadonlyArray<string> } = {
    both: KEY_NAV_KEYS,
    vertical: VERTICAL_NAV_KEYS,
    horizontal: HORIZONTAL_NAV_KEYS,
};

// Event keys union type
export type EventKey = (typeof KEY_NAV_KEYS)[number];

// Handle all navigation moves resulting in a new state.
const MOVES: {
    [N in Navigation]: (state: State, currentTabStop: TabStop, index: number) => State;
} = {
    // Move to the next item.
    // The grid is flatten so the item after the last of a row will be the
    // first item of the next row.
    NEXT(state, _, index) {
        for (let i = index + 1; i < state.tabStops.length; ++i) {
            const tabStop = state.tabStops[i];

            if (!tabStop.disabled) {
                return {
                    ...state,
                    allowFocusing: true,
                    selectedId: tabStop.id,
                };
            }
        }
        return state;
    },

    // Move to the previous item.
    // The grid is flatten so the item before the first of a row will be the
    // last item of the previous row.
    PREVIOUS(state, _, index) {
        for (let i = index - 1; i >= 0; --i) {
            const tabStop = state.tabStops[i];

            if (!tabStop.disabled) {
                return {
                    ...state,
                    allowFocusing: true,
                    selectedId: tabStop.id,
                };
            }
        }
        return state;
    },

    // Moving to the next row
    // We move to the next row, and we stay in the same column.
    // If we are in the last row, then we move to the first not disabled item of the next column.
    NEXT_ROW(state, currentTabStop) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { rowIndex, columnOffset } = cellCoordinates;
        const nextRow = rowIndex + 1;

        /** First try to get the next cell in the current column */
        let tabStop = getCell(gridMap, {
            row: {
                from: nextRow,
                direction: 'asc',
            },
            col: columnOffset,
        });

        // If none were found, search for the next cell depending on the loop around parameter
        if (!tabStop) {
            switch (state.loopAround.col) {
                /**
                 * If columns are configured to be looped inside,
                 * get the first enabled cell of the current column
                 */
                case LOOP_AROUND_TYPES.inside:
                    tabStop = getCell(gridMap, {
                        col: columnOffset,
                        row: {
                            from: 0,
                            direction: 'asc',
                        },
                    });
                    break;
                /**
                 * If columns are configured to be go to the next,
                 * search for the next enabled cell from the next column
                 */
                case LOOP_AROUND_TYPES.nextEnd:
                case LOOP_AROUND_TYPES.nextLoop:
                default:
                    tabStop = getCell(gridMap, {
                        row: {
                            from: 0,
                            direction: 'asc',
                        },
                        col: {
                            from: columnOffset + 1,
                            direction: 'asc',
                        },
                    });
                    break;
            }
        }

        /**
         * If still none is found and the columns are configured to loop
         * search starting from the start
         */
        if (!tabStop && state.loopAround.col === LOOP_AROUND_TYPES.nextLoop) {
            tabStop = getCell(gridMap, {
                row: {
                    from: 0,
                    direction: 'asc',
                },
                col: {
                    from: 0,
                    direction: 'asc',
                },
            });
        }

        if (tabStop) {
            return {
                ...state,
                allowFocusing: true,
                selectedId: tabStop.id,
                gridMap,
            };
        }

        return { ...state, allowFocusing: true, gridMap };
    },

    // Moving to the previous row
    // We move to the previous row, and we stay in the same column.
    // If we are in the first row, then we move to the last not disabled item of the previous column.
    PREVIOUS_ROW(state, currentTabStop) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { rowIndex, columnOffset } = cellCoordinates;
        const previousRow = rowIndex - 1;
        let tabStop;
        /** Search for the previous enabled cell in the current column */
        if (previousRow >= 0) {
            tabStop = getCell(gridMap, {
                row: {
                    from: previousRow,
                    direction: 'desc',
                },
                col: columnOffset,
            });
        }

        // If none were found, search for the previous cell depending on the loop around parameter
        if (!tabStop) {
            switch (state.loopAround.col) {
                /**
                 * If columns are configured to be looped inside,
                 * get the last enabled cell of the current column
                 */
                case LOOP_AROUND_TYPES.inside:
                    tabStop = getCell(gridMap, {
                        col: columnOffset,
                        row: {
                            from: -1,
                            direction: 'desc',
                        },
                    });
                    break;
                /**
                 * If columns are configured to be go to the previous,
                 * search for the last enabled cell from the previous column
                 */
                case LOOP_AROUND_TYPES.nextEnd:
                case LOOP_AROUND_TYPES.nextLoop:
                default:
                    if (columnOffset - 1 >= 0) {
                        tabStop = getCell(gridMap, {
                            row: {
                                from: -1,
                                direction: 'desc',
                            },
                            col: {
                                from: columnOffset - 1,
                                direction: 'desc',
                            },
                        });
                        break;
                    }
            }
        }
        /**
         * If still none is found and the columns are configured to loop
         * search starting from the end
         */
        if (!tabStop && state.loopAround.col === LOOP_AROUND_TYPES.nextLoop) {
            tabStop = getCell(gridMap, {
                row: {
                    from: -1,
                    direction: 'desc',
                },
                col: {
                    from: -1,
                    direction: 'desc',
                },
            });
        }

        if (tabStop) {
            return {
                ...state,
                allowFocusing: true,
                selectedId: tabStop.id,
                gridMap,
            };
        }

        return { ...state, allowFocusing: true, gridMap };
    },
    // Moving to the very first not disabled item of the list
    VERY_FIRST(state) {
        // The very first not disabled item' index.
        const tabStop = state.tabStops.find(tabStopIsEnabled);
        if (tabStop) {
            return {
                ...state,
                allowFocusing: true,
                selectedId: tabStop.id,
            };
        }
        return state;
    },
    // Moving to the very last not disabled item of the list
    VERY_LAST(state) {
        // The very last not disabled item' index.
        const tabStop = findLast(state.tabStops, tabStopIsEnabled);
        if (tabStop) {
            return {
                ...state,
                allowFocusing: true,
                selectedId: tabStop.id,
            };
        }
        return state;
    },
    NEXT_COLUMN(state, currentTabStop, index) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { rowIndex, columnOffset } = cellCoordinates;
        // Parse the current row and look for the next enabled cell
        let tabStop = getCell(gridMap, {
            row: rowIndex,
            col: {
                from: columnOffset + 1,
                direction: 'asc',
            },
        });

        // If none were found, search for the next cell depending on the loop around parameter
        if (!tabStop) {
            switch (state.loopAround.row) {
                /**
                 * If rows are configured to be looped inside,
                 * get the first enabled cell of the current rows
                 */
                case LOOP_AROUND_TYPES.inside:
                    tabStop = getCell(gridMap, {
                        row: rowIndex,
                        col: {
                            from: 0,
                            direction: 'asc',
                        },
                    });
                    break;
                /**
                 * If rows are configured to be go to the next,
                 * search for the next enabled cell from the next row
                 */
                case LOOP_AROUND_TYPES.nextEnd:
                case LOOP_AROUND_TYPES.nextLoop:
                default:
                    tabStop = find(state.tabStops, tabStopIsEnabled, index + 1);
                    break;
            }
        }
        /**
         * If still none is found and the row are configured to loop
         * search starting from the start
         */
        if (!tabStop && state.loopAround.row === LOOP_AROUND_TYPES.nextLoop) {
            tabStop = find(state.tabStops, tabStopIsEnabled);
        }

        return {
            ...state,
            allowFocusing: true,
            selectedId: tabStop?.id || state.selectedId,
            gridMap,
        };
    },
    PREVIOUS_COLUMN(state, currentTabStop, index) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { rowIndex, columnOffset } = cellCoordinates;

        const previousColumn = columnOffset - 1;
        let tabStop;

        if (previousColumn >= 0) {
            // Parse the current row and look for the next enable cell
            tabStop = getCell(gridMap, {
                row: rowIndex,
                col: {
                    from: previousColumn,
                    direction: 'desc',
                },
            });
        }
        if (!tabStop) {
            switch (state.loopAround.row) {
                /**
                 * If rows are configured to be looped inside,
                 * get the last enabled cell of the current row
                 */
                case LOOP_AROUND_TYPES.inside:
                    tabStop = getCell(gridMap, {
                        row: rowIndex,
                        col: {
                            from: -1,
                            direction: 'desc',
                        },
                    });
                    break;
                /**
                 * If rows are configured to be go to the next,
                 * search for the previous enabled cell from the previous row
                 */
                case LOOP_AROUND_TYPES.nextEnd:
                case LOOP_AROUND_TYPES.nextLoop:
                default:
                    if (index - 1 >= 0) {
                        tabStop = findLast(state.tabStops, tabStopIsEnabled, index - 1);
                    }
                    break;
            }
        }
        /**
         * If still none is found and the rows are configured to loop
         * search starting from the end
         */
        if (!tabStop && state.loopAround.row === LOOP_AROUND_TYPES.nextLoop) {
            tabStop = findLast(state.tabStops, tabStopIsEnabled);
        }

        return {
            ...state,
            allowFocusing: true,
            selectedId: tabStop?.id || state.selectedId,
            gridMap,
        };
    },
    FIRST_IN_COLUMN(state, currentTabStop) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { columnOffset } = cellCoordinates;

        const tabStop = getCell(gridMap, {
            col: columnOffset,
            row: {
                from: 0,
                direction: 'asc',
            },
        });

        return {
            ...state,
            allowFocusing: true,
            selectedId: tabStop?.id || state.selectedId,
            gridMap,
        };
    },
    LAST_IN_COLUMN(state, currentTabStop) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { columnOffset } = cellCoordinates;

        const tabStop = getCell(gridMap, {
            col: columnOffset,
            row: {
                from: -1,
                direction: 'desc',
            },
        });

        return {
            ...state,
            allowFocusing: true,
            selectedId: tabStop?.id || state.selectedId,
            gridMap,
        };
    },
    // Moving to the first item in row
    FIRST_IN_ROW(state, currentTabStop) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { rowIndex } = cellCoordinates;

        const tabStop = getCell(gridMap, {
            row: rowIndex,
            col: {
                from: 0,
                direction: 'asc',
            },
        });
        return {
            ...state,
            allowFocusing: true,
            selectedId: tabStop?.id || state.selectedId,
            gridMap,
        };
    },
    // Moving to the last item in row
    LAST_IN_ROW(state, currentTabStop) {
        const currentRowKey = currentTabStop.rowKey;
        if (isNil(currentRowKey)) {
            return state;
        }
        const gridMap = state.gridMap || createGridMap(state.tabStops);
        const cellCoordinates = getCellCoordinates(gridMap, currentTabStop);
        if (!cellCoordinates) {
            return state;
        }
        const { rowIndex } = cellCoordinates;

        const tabStop = getCell(gridMap, {
            row: rowIndex,
            col: {
                from: -1,
                direction: 'desc',
            },
        });
        return {
            ...state,
            allowFocusing: true,
            selectedId: tabStop?.id || state.selectedId,
            gridMap,
        };
    },
};

/** Handle `KEY_NAV` action to update */
export const KEY_NAV: Reducer<KeyNavAction> = (state, action) => {
    const { id = state.selectedId || state.tabStops[0]?.id, key, ctrlKey } = action.payload;
    const index = state.tabStops.findIndex((tabStop) => tabStop.id === id);
    if (index === -1) {
        // tab stop not registered
        return state;
    }
    const currentTabStop = state.tabStops[index];
    if (currentTabStop.disabled) {
        return state;
    }

    const isGrid = currentTabStop.rowKey !== null;
    const isFirst = index === state.tabStops.findIndex(tabStopIsEnabled);
    const isLast = index === findLastIndex(state.tabStops, tabStopIsEnabled);
    // Translates the user key down event info into a navigation instruction.
    let navigation: Navigation | null = null;
    // eslint-disable-next-line default-case
    switch (key) {
        case 'ArrowLeft':
            if (isGrid) {
                navigation = 'PREVIOUS_COLUMN';
            } else if (state.direction === 'horizontal' || state.direction === 'both') {
                navigation =
                    shouldLoopListHorizontally(state.direction, state.loopAround) && isFirst ? 'VERY_LAST' : 'PREVIOUS';
            }
            break;
        case 'ArrowRight':
            if (isGrid) {
                navigation = 'NEXT_COLUMN';
            } else if (state.direction === 'horizontal' || state.direction === 'both') {
                navigation =
                    shouldLoopListHorizontally(state.direction, state.loopAround) && isLast ? 'VERY_FIRST' : 'NEXT';
            }
            break;
        case 'ArrowUp':
            if (isGrid) {
                navigation = 'PREVIOUS_ROW';
            } else if (state.direction === 'vertical' || state.direction === 'both') {
                navigation =
                    shouldLoopListVertically(state.direction, state.loopAround) && isFirst ? 'VERY_LAST' : 'PREVIOUS';
            }
            break;
        case 'ArrowDown':
            if (isGrid) {
                navigation = 'NEXT_ROW';
            } else if (state.direction === 'vertical' || state.direction === 'both') {
                navigation =
                    shouldLoopListVertically(state.direction, state.loopAround) && isLast ? 'VERY_FIRST' : 'NEXT';
            }
            break;
        case 'Home':
            if (isGrid && !ctrlKey) {
                navigation = state.gridJumpToShortcutDirection === 'vertical' ? 'FIRST_IN_COLUMN' : 'FIRST_IN_ROW';
            } else {
                navigation = 'VERY_FIRST';
            }
            break;
        case 'End':
            if (isGrid && !ctrlKey) {
                navigation = state.gridJumpToShortcutDirection === 'vertical' ? 'LAST_IN_COLUMN' : 'LAST_IN_ROW';
            } else {
                navigation = 'VERY_LAST';
            }
            break;
    }

    if (!navigation) {
        return state;
    }

    const newState = MOVES[navigation](state, currentTabStop, index);

    return { ...newState, isUsingKeyboard: true };
};
