import { createActiveItemState } from './createActiveItemState';
import { createPendingNavigation } from './createPendingNavigation';
import type {
    FocusNavigationCallbacks,
    FocusNavigationSelectors,
    GridFocusNavigationController,
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
 * Supports Up/Down between rows (with column memory), Left/Right between cells
 * (with wrapping across rows) and Home/End within the active row.
 *
 * Columns are counted by position: every cell matching `cellSelector` counts, including the
 * non-navigable cells matching `cellDisabledSelector` (focus skips them). The column memory keeps
 * this position index.
 *
 * Edges: with `onBoundary`, a move that finds no navigable target calls it (see
 * {@link GridNavigationOptions.onBoundary}); otherwise `wrap` decides.
 *
 * @param options Grid navigation options.
 * @param callbacks Callbacks for focus state changes.
 * @param signal AbortSignal for cleanup.
 * @returns GridFocusNavigationController instance.
 */
export function createGridFocusNavigation(
    options: GridNavigationOptions,
    callbacks: FocusNavigationCallbacks,
    signal: AbortSignal,
): GridFocusNavigationController {
    const { container, rowSelector, cellSelector, cellDisabledSelector, wrap = false, onBoundary } = options;
    const state = createActiveItemState(callbacks, signal);

    const isNavigableCell = (cell: HTMLElement) => !cellDisabledSelector || !cell.matches(cellDisabledSelector);
    const hasCells = (row: HTMLElement) => row.querySelector(cellSelector) !== null;
    /** All cells of a row (by position, non-navigable cells included). */
    const getRowCells = (row: HTMLElement) => Array.from(row.querySelectorAll<HTMLElement>(cellSelector));

    /** Position index of the first (or last) navigable cell in `cells` (-1 if none). */
    function findNavigableIndex(cells: HTMLElement[], from: 'start' | 'end'): number {
        if (from === 'start') return cells.findIndex(isNavigableCell);
        for (let i = cells.length - 1; i >= 0; i -= 1) {
            if (isNavigableCell(cells[i])) return i;
        }
        return -1;
    }

    function getFirstNavigableCell(row: HTMLElement): HTMLElement | null {
        if (!cellDisabledSelector) return row.querySelector<HTMLElement>(cellSelector);
        return getRowCells(row).find(isNavigableCell) ?? null;
    }

    const navigableRow = (row: HTMLElement) => (getFirstNavigableCell(row) ? row : null);

    /**
     * Lazily walk the rows that contain cells from `start` in a `direction`, projecting each row
     * through `dive` (rows projected to `null` are skipped).
     */
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
            if (node && hasCells(node)) {
                const result = dive ? dive(node) : node;
                if (result) yield result;
            }
        } while (node);
    }

    /** Lazily walk the rows that contain at least one navigable cell. */
    const findNavigableRows = (start: HTMLElement | 'first' | 'last' = 'first', direction: 'next' | 'prev' = 'next') =>
        findRows(start, direction, navigableRow);

    const findFirstVisibleRow = () => first(findNavigableRows());
    const findLastVisibleRow = () => first(findNavigableRows('last', 'prev'));

    function findParentRow(cell: HTMLElement): HTMLElement | null {
        const row = cell.closest<HTMLElement>(rowSelector);
        return row && container.contains(row) ? row : null;
    }

    /** Deferred navigation intent (replayed once cells are committed to the DOM). */
    const pending = createPendingNavigation(signal);
    /** Remembered column index (position) for Up/Down navigation (column memory). */
    let rememberedCol = 0;

    /** Activate a cell. A newer move wins over the pending navigation: drop it. */
    function activate(cell: HTMLElement) {
        pending.clear();
        state.setActive(cell);
    }

    /** Activate the cell at the given column in a row element (no move if that cell is not navigable). */
    function focusCellInRow(row: HTMLElement, col: number): boolean {
        const cells = getRowCells(row);
        if (cells.length === 0) return false;
        const clampedCol = Math.min(col, cells.length - 1);
        const cell = cells[clampedCol];
        if (!isNavigableCell(cell)) return false;
        activate(cell);
        return true;
    }

    /** Activate the cell at the first or last navigable position of a row (updates column memory). */
    function focusRowEdge(row: HTMLElement, edge: 'start' | 'end'): boolean {
        const cells = getRowCells(row);
        const col = findNavigableIndex(cells, edge);
        if (col === -1) return false;
        rememberedCol = col;
        activate(cells[col]);
        return true;
    }

    /** Activate the given cell (validates it is a navigable cell of the grid, updates column memory). */
    function activateCell(item: HTMLElement): boolean {
        if (!isNavigableCell(item)) return false;
        const row = findParentRow(item);
        if (!row) return false;
        const cells = getRowCells(row);
        const col = cells.indexOf(item);
        if (col === -1) return false;
        rememberedCol = col;
        activate(item);
        return true;
    }

    /** Go to first navigable cell in first row */
    function goToFirst(): boolean {
        const row = findFirstVisibleRow();
        if (!row) return false;
        return focusRowEdge(row, 'start');
    }

    /** Go to first navigable cell in last row */
    function goToLast(): boolean {
        const row = findLastVisibleRow();
        if (!row) return false;
        return focusRowEdge(row, 'start');
    }

    /** Move to the first or last navigable cell of the active row. */
    function goToRowEdge(edge: 'start' | 'end'): boolean {
        if (!state.active) return false;
        const row = findParentRow(state.active);
        if (!row) return false;
        return focusRowEdge(row, edge);
    }

    /** Navigate horizontally (left or right) within cells, skipping non-navigable cells. */
    function goHorizontal(step: -1 | 1): boolean {
        const { active } = state;
        if (!active) return false;

        const currentRow = findParentRow(active);
        if (!currentRow) return false;

        const cells = getRowCells(currentRow);
        const col = cells.indexOf(active);
        if (col === -1) return false;

        for (let nextCol = col + step; nextCol >= 0 && nextCol < cells.length; nextCol += step) {
            if (isNavigableCell(cells[nextCol])) {
                rememberedCol = nextCol;
                activate(cells[nextCol]);
                return true;
            }
        }

        // Past the first or last navigable cell of the row
        if (onBoundary) return onBoundary(step > 0 ? 'right' : 'left', active);
        if (!wrap) return false;

        // Wrap to the adjacent row (or opposite boundary row), activating the first or last cell.
        const rowDirection = step > 0 ? 'next' : 'prev';
        const adjacentRow = first(findNavigableRows(currentRow, rowDirection));
        const targetRow = adjacentRow ?? (step > 0 ? findFirstVisibleRow() : findLastVisibleRow());
        if (!targetRow) return false;
        return focusRowEdge(targetRow, step > 0 ? 'start' : 'end');
    }

    /** Navigate vertically (up or down) between rows with column memory. */
    function goVertical(direction: 'next' | 'prev'): boolean {
        const { active } = state;
        if (!active) {
            // No active cell — go to the boundary row.
            return direction === 'next' ? goToFirst() : goToLast();
        }

        const currentRow = findParentRow(active);
        if (!currentRow) return false;

        const boundaryDirection = direction === 'next' ? 'down' : 'up';
        const adjacentRow = first(findRows(currentRow, direction));
        if (adjacentRow) {
            if (focusCellInRow(adjacentRow, rememberedCol)) return true;
            // Target cell is not navigable (disabled or blank)
            return onBoundary ? onBoundary(boundaryDirection, active) : false;
        }

        // Past the first or last row
        if (onBoundary) return onBoundary(boundaryDirection, active);

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
            return first(findNavigableRows()) !== null;
        },
        // First navigable cell in first row
        getFirst: () => first(findRows('first', 'next', getFirstNavigableCell)),
        // First navigable cell in last row
        getLast: () => first(findRows('last', 'prev', getFirstNavigableCell)),
        // First navigable cell matching predicate
        getMatching: (predicate) =>
            first(findRows('first', 'next', (row) => getRowCells(row).find((c) => isNavigableCell(c) && predicate(c)))),
    };

    return {
        type: 'grid',
        selectors,

        goToRowStart: () => goToRowEdge('start'),
        goToRowEnd: () => goToRowEdge('end'),

        goToOffset(offset: number): boolean {
            if (offset === 0) return state.active !== null;
            const visibleRows = Array.from(findNavigableRows());
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
            if (target && activateCell(target)) return true;
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
