import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';
import { createActiveItemState } from './createActiveItemState';
import type { FocusNavigationCallbacks, FocusNavigationController, GridNavigationOptions } from './types';

/**
 * Create a focus navigation controller for a 2D grid.
 *
 * Supports Up/Down between rows (with column memory) and Left/Right between cells
 * (with wrapping across rows).
 *
 * @param options Grid navigation options (container, rowSelector, cellSelector, isRowVisible, wrap).
 * @param callbacks Callbacks for focus state changes.
 * @param signal AbortSignal for cleanup.
 * @returns FocusNavigationController instance.
 */
export function createGridFocusNavigation(
    options: GridNavigationOptions,
    callbacks: FocusNavigationCallbacks,
    signal: AbortSignal,
): FocusNavigationController {
    const { container, rowSelector, cellSelector, isRowVisible, wrap = false } = options;
    const state = createActiveItemState(callbacks, signal);
    /** Remembered column index for Up/Down navigation (column memory). */
    let rememberedCol = 0;

    /** Check if a row element is visible (passes the isRowVisible filter). */
    function isVisible(row: HTMLElement): boolean {
        return !isRowVisible || isRowVisible(row);
    }

    /** Check if a row is navigable (visible with at least one cell). */
    function isNavigableRow(row: HTMLElement): boolean {
        return isVisible(row) && row.querySelector(cellSelector) !== null;
    }

    /** Create a TreeWalker scoped to row elements within the container. */
    function createRowWalker(): TreeWalker {
        return createSelectorTreeWalker(container, rowSelector);
    }

    /**
     * Iterate navigable rows from the container using a TreeWalker.
     * - `'first'`: returns the first navigable row (or null).
     * - `'last'`: returns the last navigable row (or null).
     * - `'all'`: returns all navigable rows as an array.
     */
    function findVisibleRows(mode: 'first'): HTMLElement | null;
    function findVisibleRows(mode: 'last'): HTMLElement | null;
    function findVisibleRows(mode: 'all'): HTMLElement[];
    function findVisibleRows(mode: 'first' | 'last' | 'all'): HTMLElement | HTMLElement[] | null {
        const walker = createRowWalker();
        if (mode === 'all') {
            const result: HTMLElement[] = [];
            let node = walker.nextNode() as HTMLElement | null;
            while (node) {
                if (isNavigableRow(node)) result.push(node);
                node = walker.nextNode() as HTMLElement | null;
            }
            return result;
        }
        let found: HTMLElement | null = null;
        let node = walker.nextNode() as HTMLElement | null;
        while (node) {
            if (isNavigableRow(node)) {
                if (mode === 'first') return node;
                found = node;
            }
            node = walker.nextNode() as HTMLElement | null;
        }
        return found;
    }

    /** Get the cells within a single row element. */
    function getRowCells(row: HTMLElement): HTMLElement[] {
        return Array.from(row.querySelectorAll<HTMLElement>(cellSelector));
    }

    /** Find the row element containing a cell, using closest(). */
    function findParentRow(cell: HTMLElement): HTMLElement | null {
        const row = cell.closest<HTMLElement>(rowSelector);
        return row && container.contains(row) ? row : null;
    }

    /**
     * Walk to the next or previous visible row (with cells) from a given row
     * using a TreeWalker. Avoids building the full visible rows array.
     */
    function findAdjacentVisibleRow(fromRow: HTMLElement, direction: 'next' | 'prev'): HTMLElement | null {
        const walker = createRowWalker();
        walker.currentNode = fromRow;
        const advance = direction === 'next' ? () => walker.nextNode() : () => walker.previousNode();
        let node = advance() as HTMLElement | null;
        while (node) {
            if (isNavigableRow(node)) return node;
            node = advance() as HTMLElement | null;
        }
        return null;
    }

    /**
     * Activate the cell at the given column in a row element.
     * Clamps col to the row's available cells.
     */
    function focusCellInRow(row: HTMLElement, col: number): boolean {
        const cells = getRowCells(row);
        if (cells.length === 0) return false;
        const clampedCol = Math.min(col, cells.length - 1);
        state.setActive(cells[clampedCol]);
        return true;
    }

    function goToFirst(): boolean {
        const row = findVisibleRows('first');
        if (!row) return false;
        rememberedCol = 0;
        return focusCellInRow(row, 0);
    }

    function goToLast(): boolean {
        const row = findVisibleRows('last');
        if (!row) return false;
        rememberedCol = 0;
        return focusCellInRow(row, 0);
    }

    /** Navigate horizontally (left or right) within cells, wrapping across rows. */
    function goHorizontal(step: -1 | 1): boolean {
        if (!state.active) return false;

        const currentRow = findParentRow(state.active);
        if (!currentRow) return false;

        const cells = getRowCells(currentRow);
        const col = cells.indexOf(state.active);
        if (col === -1) return false;

        const nextCol = col + step;
        if (nextCol >= 0 && nextCol < cells.length) {
            rememberedCol = nextCol;
            state.setActive(cells[nextCol]);
            return true;
        }

        if (!wrap) return false;

        // Wrap to the adjacent row (or opposite boundary row), activating the first or last cell.
        const rowDirection = step > 0 ? 'next' : 'prev';
        const adjacentRow = findAdjacentVisibleRow(currentRow, rowDirection);
        const targetRow = adjacentRow ?? (step > 0 ? findVisibleRows('first') : findVisibleRows('last'));
        if (!targetRow) return false;

        const targetCells = getRowCells(targetRow);
        if (targetCells.length === 0) return false;
        const targetCol = step > 0 ? 0 : targetCells.length - 1;
        rememberedCol = targetCol;
        state.setActive(targetCells[targetCol]);
        return true;
    }

    /** Navigate vertically (up or down) between rows with column memory. */
    function goVertical(direction: 'next' | 'prev'): boolean {
        if (!state.active) {
            // No active cell — go to the boundary row.
            return direction === 'next' ? goToFirst() : goToLast();
        }

        const currentRow = findParentRow(state.active);
        if (!currentRow) return false;

        const adjacentRow = findAdjacentVisibleRow(currentRow, direction);
        if (adjacentRow) return focusCellInRow(adjacentRow, rememberedCol);

        if (wrap) {
            // Wrap to the opposite boundary row.
            const wrapRow = direction === 'next' ? findVisibleRows('first') : findVisibleRows('last');
            if (wrapRow) return focusCellInRow(wrapRow, rememberedCol);
        }
        return false;
    }

    return {
        type: 'grid',

        get activeItem() {
            return state.active;
        },
        get hasActiveItem() {
            return state.active !== null;
        },
        get hasNavigableItems() {
            return findVisibleRows('first') !== null;
        },

        goToFirst,
        goToLast,

        goToOffset(offset: number): boolean {
            if (offset === 0) return state.active !== null;
            const visibleRows = findVisibleRows('all');
            if (visibleRows.length === 0) return false;

            if (!state.active) {
                // No active item: jump to first or last row, then apply remaining offset.
                const startIdx = offset > 0 ? 0 : visibleRows.length - 1;
                const remainingOffset = offset > 0 ? offset - 1 : offset + 1;
                const targetIdx = Math.max(0, Math.min(startIdx + remainingOffset, visibleRows.length - 1));
                return focusCellInRow(visibleRows[targetIdx], rememberedCol);
            }

            // Find current row in the visible rows list.
            const currentRow = findParentRow(state.active);
            if (!currentRow) return false;
            const rowIdx = visibleRows.indexOf(currentRow);
            if (rowIdx === -1) return false;

            const targetIdx = Math.max(0, Math.min(rowIdx + offset, visibleRows.length - 1));
            if (targetIdx === rowIdx) return false;
            return focusCellInRow(visibleRows[targetIdx], rememberedCol);
        },

        goToItemMatching(predicate: (item: HTMLElement) => boolean): boolean {
            // Iterate visible rows lazily — short-circuit on first match.
            const walker = createRowWalker();
            let row = walker.nextNode() as HTMLElement | null;
            while (row) {
                if (isNavigableRow(row)) {
                    const cells = getRowCells(row);
                    for (let c = 0; c < cells.length; c++) {
                        if (predicate(cells[c])) {
                            rememberedCol = c;
                            state.setActive(cells[c]);
                            return true;
                        }
                    }
                }
                row = walker.nextNode() as HTMLElement | null;
            }
            return false;
        },

        goToItem(item: HTMLElement): boolean {
            // Use closest() to find the parent row, then find col within that row only.
            const row = findParentRow(item);
            if (!row || !isVisible(row)) return false;
            const cells = getRowCells(row);
            const col = cells.indexOf(item);
            if (col === -1) return false;
            rememberedCol = col;
            state.setActive(item);
            return true;
        },

        clear(): void {
            state.clear();
        },

        goUp(): boolean {
            return goVertical('prev');
        },

        goDown(): boolean {
            return goVertical('next');
        },

        goLeft(): boolean {
            return goHorizontal(-1);
        },

        goRight(): boolean {
            return goHorizontal(1);
        },
    };
}
