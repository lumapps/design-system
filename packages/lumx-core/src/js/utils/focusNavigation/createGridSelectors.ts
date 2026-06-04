import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';
import { lastDescendant } from '../browser/lastDescendant';
import { first } from '../iterable/first';
import type { FocusNavigationSelectors, GridNavigationOptions } from './types';

/**
 * Create the pure selection layer for a 2D grid.
 *
 * Everything here is side-effect-free: it only *queries* the DOM to resolve and report
 * rows/cells. No focus is moved and no {@link FocusNavigationCallbacks} are invoked — that
 * is the job of the mover layer built on top of this.
 *
 * @param options Grid navigation options (container, rowSelector, cellSelector).
 * @param getActive Reader for the currently active cell (owned by the mover's active-item state).
 * @param isVisible Predicate deciding whether a row is visible (derived from `isRowVisible`).
 * @returns The public {@link FocusNavigationSelectors} plus the internal
 *   {@link GridSelectorHelpers} the mover layer consumes.
 */
export function createGridSelectors(
    options: GridNavigationOptions,
    getActive: () => HTMLElement | null,
    isVisible: (row: HTMLElement) => boolean,
) {
    const { container, rowSelector, cellSelector } = options;

    function isNavigableRow(row: HTMLElement): boolean {
        return isVisible(row) && row.querySelector(cellSelector) !== null;
    }

    /**
     * Lazily walk navigable rows (visible, with cells) starting from `startNode` in
     * `direction`, projecting each row through `dive`.
     */
    function* findRow(
        direction: 'next' | 'prev',
        startNode: HTMLElement | null = null,
        dive?: (row: HTMLElement) => HTMLElement | null,
    ): Generator<HTMLElement> {
        const walker = createSelectorTreeWalker(container, rowSelector);
        if (startNode) walker.currentNode = startNode;
        const advance = direction === 'next' ? () => walker.nextNode() : () => walker.previousNode();
        let node = advance() as HTMLElement | null;
        while (node) {
            if (isNavigableRow(node)) {
                const result = dive ? dive(node) : node;
                if (result) yield result;
            }
            node = advance() as HTMLElement | null;
        }
    }

    /** Find the first or last navigable row (visible, with cells), or null. */
    function findVisibleRow(mode: 'first' | 'last'): HTMLElement | null {
        return mode === 'first' ? first(findRow('next')) : first(findRow('prev', lastDescendant(container)));
    }

    /** Collect all navigable rows (visible, with cells) in DOM order. */
    function findAllVisibleRows(): HTMLElement[] {
        return Array.from(findRow('next'));
    }

    function getRowCells(row: HTMLElement): HTMLElement[] {
        return Array.from(row.querySelectorAll<HTMLElement>(cellSelector));
    }

    function findParentRow(cell: HTMLElement): HTMLElement | null {
        const row = cell.closest<HTMLElement>(rowSelector);
        return row && container.contains(row) ? row : null;
    }

    function findAdjacentVisibleRow(fromRow: HTMLElement, direction: 'next' | 'prev'): HTMLElement | null {
        return first(findRow(direction, fromRow));
    }

    /** Resolve the first cell of the boundary row (without moving focus). */
    function getBoundaryCell(mode: 'first' | 'last'): HTMLElement | null {
        const row = findVisibleRow(mode);
        if (!row) return null;
        const cells = getRowCells(row);
        return cells.length > 0 ? cells[0] : null;
    }

    /** Resolve the first cell matching a predicate (without moving focus). */
    function getMatching(predicate: (item: HTMLElement) => boolean): HTMLElement | null {
        return first(findRow('next', null, (row) => getRowCells(row).find(predicate) ?? null));
    }

    const selectors: FocusNavigationSelectors = {
        get activeItem() {
            return getActive();
        },
        get hasNavigableItems() {
            return first(findRow('next')) !== null;
        },
        getFirst: () => getBoundaryCell('first'),
        getLast: () => getBoundaryCell('last'),
        getMatching,
    };

    const helpers = {
        findFirstVisibleRow: () => findVisibleRow('first'),
        findLastVisibleRow: () => findVisibleRow('last'),
        findAllVisibleRows,
        getRowCells,
        findParentRow,
        findAdjacentVisibleRow,
    };

    return { selectors, helpers };
}
