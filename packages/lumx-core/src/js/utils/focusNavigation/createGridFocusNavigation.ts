import { createActiveItemState } from './createActiveItemState';
import { createPendingNavigation } from './createPendingNavigation';
import type {
    FocusNavigationCallbacks,
    FocusNavigationController,
    FocusNavigationSelectors,
    GridNavigationOptions,
} from './types';
import { lastDescendant } from '../browser/lastDescendant';
import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';
import { first } from '../iterable/first';

/**
 * Create a focus navigation controller for a 2D grid.
 *
 * Resolves rows and cells by querying the DOM and commits focus by updating the
 * active-item state (which fires {@link FocusNavigationCallbacks}).
 *
 * Supports Up/Down between rows (with column memory) and Left/Right between cells
 * (with wrapping across rows).
 *
 * @param options Grid navigation options (container, rowSelector, cellSelector, wrap).
 * @param callbacks Callbacks for focus state changes.
 * @param signal AbortSignal for cleanup.
 * @returns FocusNavigationController instance.
 */
export function createGridFocusNavigation(
    options: GridNavigationOptions,
    callbacks: FocusNavigationCallbacks,
    signal: AbortSignal,
): FocusNavigationController {
    const { container, rowSelector, cellSelector, wrap = false } = options;
    const state = createActiveItemState(callbacks, signal);

    const isNavigableRow = (row: HTMLElement) => row.querySelector(cellSelector) !== null;
    const getFirstCell = (row: HTMLElement) => row.querySelector<HTMLElement>(cellSelector);
    const getRowCells = (row: HTMLElement) => Array.from(row.querySelectorAll<HTMLElement>(cellSelector));

    /** Lazily walk navigable rows from `start` in a `direction`, projecting each row through `dive`. */
    function* findRows(
        start: HTMLElement | 'first' | 'last' = 'first',
        direction: 'next' | 'prev' = 'next',
        dive?: (row: HTMLElement) => HTMLElement | undefined | null,
    ) {
        // Tree walker
        const walker = createSelectorTreeWalker(container, rowSelector);

        // Start at a specific row
        if (start instanceof HTMLElement) walker.currentNode = start;
        // Start from the last
        else if (start === 'last') walker.currentNode = lastDescendant(container);

        // Walk nodes
        let node: HTMLElement | null;
        do {
            node = (direction === 'next' ? walker.nextNode() : walker.previousNode()) as HTMLElement | null;
            if (node && isNavigableRow(node)) {
                const result = dive ? dive(node) : node;
                if (result) yield result;
            }
        } while (node);
    }

    const findFirstVisibleRow = () => first(findRows());
    const findLastVisibleRow = () => first(findRows('last', 'prev'));

    function findParentRow(cell: HTMLElement): HTMLElement | null {
        const row = cell.closest<HTMLElement>(rowSelector);
        return row && container.contains(row) ? row : null;
    }

    /** Deferred navigation intent (replayed once cells are committed to the DOM). */
    const pending = createPendingNavigation(signal);
    /** Remembered column index for Up/Down navigation (column memory). */
    let rememberedCol = 0;

    /** Activate the cell at the given column in a row element. */
    function focusCellInRow(row: HTMLElement, col: number): boolean {
        const cells = getRowCells(row);
        if (cells.length === 0) return false;
        const clampedCol = Math.min(col, cells.length - 1);
        state.setActive(cells[clampedCol]);
        return true;
    }

    /** Activate the given cell (validates it is in the grid, updates column memory). */
    function activateCell(item: HTMLElement): boolean {
        const row = findParentRow(item);
        if (!row) return false;
        const cells = getRowCells(row);
        const col = cells.indexOf(item);
        if (col === -1) return false;
        rememberedCol = col;
        state.setActive(item);
        return true;
    }

    /** Got to first cell in first row */
    function goToFirst(): boolean {
        const row = findFirstVisibleRow();
        if (!row) return false;
        rememberedCol = 0;
        return focusCellInRow(row, 0);
    }

    /** Got to first cell in last row */
    function goToLast(): boolean {
        const row = findLastVisibleRow();
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
        const adjacentRow = first(findRows(currentRow, rowDirection));
        const targetRow = adjacentRow ?? (step > 0 ? findFirstVisibleRow() : findLastVisibleRow());
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

        const adjacentRow = first(findRows(currentRow, direction));
        if (adjacentRow) return focusCellInRow(adjacentRow, rememberedCol);

        if (wrap) {
            // Wrap to the opposite boundary row.
            const wrapRow = direction === 'next' ? findFirstVisibleRow() : findLastVisibleRow();
            if (wrapRow) return focusCellInRow(wrapRow, rememberedCol);
        }
        return false;
    }

    const selectors: FocusNavigationSelectors = {
        get activeItem() {
            return state.active;
        },
        get hasNavigableItems() {
            return first(findRows()) !== null;
        },
        // First cell in first row
        getFirst: () => first(findRows('first', 'next', getFirstCell)),
        // First cell in last row
        getLast: () => first(findRows('last', 'prev', getFirstCell)),
        // First cell matching predicate
        getMatching: (predicate) => first(findRows('first', 'next', (row) => getRowCells(row).find(predicate))),
    };

    return {
        type: 'grid',
        selectors,

        goToOffset(offset: number): boolean {
            if (offset === 0) return state.active !== null;
            const visibleRows = Array.from(findRows());
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

        clear(): void {
            state.clear();
            pending.clear();
        },

        goTo(resolve: (selectors: FocusNavigationSelectors) => HTMLElement | null): boolean {
            const target = resolve(selectors);
            if (target && activateCell(target)) {
                pending.clear();
                return true;
            }
            // Target not resolvable yet (e.g. cells not committed to the DOM) — defer
            pending.defer(() => this.goTo(resolve));
            return false;
        },

        flushPendingNavigation(): void {
            pending.flush();
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
