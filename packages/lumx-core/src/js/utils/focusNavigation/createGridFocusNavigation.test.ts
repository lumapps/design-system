// @vitest-environment jsdom
import { createGridFocusNavigation } from './createGridFocusNavigation';

import type { FocusNavigationCallbacks } from './types';

function createContainer(html: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    document.body.appendChild(div);
    return div.firstElementChild as HTMLElement;
}

function makeCallbacks() {
    const activated: HTMLElement[] = [];
    const deactivated: HTMLElement[] = [];
    const counter = { clearCount: 0 };
    const callbacks: FocusNavigationCallbacks = {
        onActivate: (item) => activated.push(item),
        onDeactivate: (item) => deactivated.push(item),
        onClear: () => {
            counter.clearCount += 1;
        },
    };
    return { callbacks, activated, deactivated, counter };
}

/** Create a grid container with `rows` rows and `cols` cells per row. */
function createGrid(rows: number, cols: number): HTMLElement {
    const rowsHtml = Array.from({ length: rows }, (_, r) => {
        const cells = Array.from(
            { length: cols },
            (__, c) => `<div role="gridcell" id="cell-${r}-${c}">Cell ${r}-${c}</div>`,
        ).join('');
        return `<div role="row" id="row-${r}">${cells}</div>`;
    }).join('');
    return createContainer(`<div role="grid">${rowsHtml}</div>`);
}

/** Create a grid with uneven row lengths. */
function createUnevenGrid(): HTMLElement {
    return createContainer(`
        <div role="grid">
            <div role="row" id="row-0">
                <div role="gridcell" id="cell-0-0">A</div>
                <div role="gridcell" id="cell-0-1">B</div>
                <div role="gridcell" id="cell-0-2">C</div>
            </div>
            <div role="row" id="row-1">
                <div role="gridcell" id="cell-1-0">D</div>
            </div>
            <div role="row" id="row-2">
                <div role="gridcell" id="cell-2-0">E</div>
                <div role="gridcell" id="cell-2-1">F</div>
            </div>
        </div>
    `);
}

const GRID_OPTIONS = {
    type: 'grid' as const,
    rowSelector: '[role="row"]',
    cellSelector: '[role="gridcell"]',
};

afterEach(() => {
    document.body.innerHTML = '';
});

describe('createGridFocusNavigation', () => {
    describe('type property', () => {
        it('should report type as grid', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.type).toBe('grid');
        });
    });

    describe('initial state', () => {
        it('should have no active item initially', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.activeItem).toBeNull();
            expect(nav.hasActiveItem).toBe(false);
        });

        it('should detect navigable items', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.hasNavigableItems).toBe(true);
        });

        it('should detect no navigable items in empty container', () => {
            const container = createContainer('<div role="grid"></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.hasNavigableItems).toBe(false);
        });
    });

    describe('goToFirst / goToLast', () => {
        it('should navigate to first cell (row 0, col 0)', () => {
            const container = createGrid(3, 3);
            const { callbacks, activated } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToFirst()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-0');
            expect(activated).toHaveLength(1);
        });

        it('should navigate to first cell of last row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToLast()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should return false on empty grid', () => {
            const container = createContainer('<div role="grid"></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToFirst()).toBe(false);
            expect(nav.goToLast()).toBe(false);
        });
    });

    describe('goDown / goUp (vertical navigation)', () => {
        it('goDown should move to the next row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-1-0');
        });

        it('goUp should move to the previous row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToLast();
            expect(nav.goUp()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-1-0');
        });

        it('goDown should return false at last row without wrap', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToLast();
            expect(nav.goDown()).toBe(false);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('goUp should return false at first row without wrap', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goUp()).toBe(false);
            expect(nav.activeItem?.id).toBe('cell-0-0');
        });

        it('goDown with no active item should go to first row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-0');
        });

        it('goUp with no active item should go to last row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goUp()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });
    });

    describe('column memory', () => {
        it('should remember column when navigating up/down', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Navigate to cell-0-2 (row 0, col 2)
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.activeItem?.id).toBe('cell-0-2');

            // Go down — should stay in col 2
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-1-2');

            // Go down again — should stay in col 2
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-2-2');
        });

        it('should clamp column when moving to a shorter row', () => {
            const container = createUnevenGrid();
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Navigate to cell-0-2 (row 0 has 3 cells)
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.activeItem?.id).toBe('cell-0-2');

            // Go down to row 1 (only 1 cell) — col should clamp to 0
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-1-0');

            // Go down to row 2 (2 cells) — remembered col is still 2, clamps to 1
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-2-1');
        });

        it('goToFirst should reset column memory to 0', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Set column memory to 2
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);

            // goToFirst resets column memory
            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('cell-0-0');

            // Subsequent goDown should use col 0
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-1-0');
        });

        it('goToLast should reset column memory to 0', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Set column memory to 2
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);

            // goToLast resets column memory
            nav.goToLast();
            expect(nav.activeItem?.id).toBe('cell-2-0');

            // Subsequent goUp should use col 0
            nav.goUp();
            expect(nav.activeItem?.id).toBe('cell-1-0');
        });
    });

    describe('goLeft / goRight (horizontal navigation)', () => {
        it('goRight should move to next cell in the same row', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goRight()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-1');
        });

        it('goLeft should move to previous cell in the same row', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.goLeft()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-1');
        });

        it('goRight should return false at end of row without wrap', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.goRight()).toBe(false);
        });

        it('goLeft should return false at start of row without wrap', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goLeft()).toBe(false);
        });

        it('goLeft/goRight should return false with no active item', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goLeft()).toBe(false);
            expect(nav.goRight()).toBe(false);
        });

        it('goRight should update column memory', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            nav.goRight();
            nav.goRight();
            expect(nav.activeItem?.id).toBe('cell-0-2');

            // Column memory should be 2 — goDown should land on col 2
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-1-2');
        });
    });

    describe('wrapping', () => {
        it('goDown should wrap from last row to first', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goToLast();
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-0');
        });

        it('goUp should wrap from first row to last', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goUp()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('goRight should wrap to first cell of next row', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-0-1') as HTMLElement);
            expect(nav.goRight()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-1-0');
        });

        it('goLeft should wrap to last cell of previous row', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-1-0') as HTMLElement);
            expect(nav.goLeft()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-1');
        });

        it('goRight should wrap from last cell of last row to first cell of first row', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-1-1') as HTMLElement);
            expect(nav.goRight()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-0');
        });

        it('goLeft should wrap from first cell of first row to last cell of last row', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goLeft()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-1-1');
        });
    });

    describe('goToItem', () => {
        it('should navigate to a specific cell', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            const cell = container.querySelector('#cell-1-2') as HTMLElement;
            expect(nav.goToItem(cell)).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-1-2');
        });

        it('should update column memory', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);

            // Column memory should be 2
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-1-2');
        });

        it('should return false for element not in the grid', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            const outsider = document.createElement('div');
            expect(nav.goToItem(outsider)).toBe(false);
        });
    });

    describe('goToItemMatching', () => {
        it('should navigate to first cell matching predicate', () => {
            const container = createContainer(`
                <div role="grid">
                    <div role="row">
                        <div role="gridcell" id="cell-0-0">A</div>
                        <div role="gridcell" id="cell-0-1" aria-selected="true">B</div>
                    </div>
                    <div role="row">
                        <div role="gridcell" id="cell-1-0">C</div>
                        <div role="gridcell" id="cell-1-1">D</div>
                    </div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToItemMatching((el) => el.getAttribute('aria-selected') === 'true')).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-1');
        });

        it('should return false when no cell matches', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToItemMatching(() => false)).toBe(false);
        });

        it('should update column memory to matched cell column', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToItemMatching((el) => el.id === 'cell-1-2');
            expect(nav.activeItem?.id).toBe('cell-1-2');

            // Column memory should be 2
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-2-2');
        });
    });

    describe('goToOffset', () => {
        it('should navigate forward by row offset', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            expect(nav.goToOffset(2)).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should navigate backward by row offset', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToLast();
            expect(nav.goToOffset(-2)).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should clamp at boundaries', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToLast();
            expect(nav.goToOffset(5)).toBe(false);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should start from first row when no active item and offset is positive', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToOffset(1)).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-0-0');
        });

        it('should start from last row when no active item and offset is negative', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToOffset(-1)).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-4-0');
        });

        it('should respect column memory with offset', () => {
            const container = createGrid(5, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToItem(container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.goToOffset(3)).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-3-2');
        });

        it('offset 0 should return true if active item exists, false otherwise', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToOffset(0)).toBe(false);
            nav.goToFirst();
            expect(nav.goToOffset(0)).toBe(true);
        });
    });

    describe('clear', () => {
        it('should clear active item and call onClear', () => {
            const container = createGrid(2, 2);
            const { callbacks, deactivated, counter } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            nav.clear();
            expect(nav.activeItem).toBeNull();
            expect(nav.hasActiveItem).toBe(false);
            expect(deactivated).toHaveLength(1);
            expect(counter.clearCount).toBe(1);
        });
    });

    describe('callback invocation order', () => {
        it('should call onDeactivate before onActivate when navigating', () => {
            const container = createGrid(3, 2);
            const order: string[] = [];
            const ac = new AbortController();
            const nav = createGridFocusNavigation(
                { ...GRID_OPTIONS, container },
                {
                    onActivate: (item) => order.push(`activate:${item.id}`),
                    onDeactivate: (item) => order.push(`deactivate:${item.id}`),
                    onClear: () => order.push('clear'),
                },
                ac.signal,
            );
            nav.goToFirst();
            nav.goDown();
            expect(order).toEqual(['activate:cell-0-0', 'deactivate:cell-0-0', 'activate:cell-1-0']);
        });

        it('should call onDeactivate then onClear when clearing', () => {
            const container = createGrid(2, 2);
            const order: string[] = [];
            const ac = new AbortController();
            const nav = createGridFocusNavigation(
                { ...GRID_OPTIONS, container },
                {
                    onActivate: (item) => order.push(`activate:${item.id}`),
                    onDeactivate: (item) => order.push(`deactivate:${item.id}`),
                    onClear: () => order.push('clear'),
                },
                ac.signal,
            );
            nav.goToFirst();
            nav.clear();
            expect(order).toEqual(['activate:cell-0-0', 'deactivate:cell-0-0', 'clear']);
        });
    });

    describe('cleanup on abort', () => {
        it('should deactivate and clear on abort signal', () => {
            const container = createGrid(2, 2);
            const { callbacks, deactivated, counter } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();
            ac.abort();
            expect(nav.activeItem).toBeNull();
            expect(deactivated).toHaveLength(1);
            expect(counter.clearCount).toBe(1);
        });
    });

    describe('isRowVisible filtering', () => {
        it('should skip rows where isRowVisible returns false', () => {
            const container = createContainer(`
                <div role="grid">
                    <div role="row" id="row-0">
                        <div role="gridcell" id="cell-0-0">A</div>
                    </div>
                    <div role="row" id="row-1" data-hidden>
                        <div role="gridcell" id="cell-1-0">B</div>
                    </div>
                    <div role="row" id="row-2">
                        <div role="gridcell" id="cell-2-0">C</div>
                    </div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation(
                {
                    ...GRID_OPTIONS,
                    container,
                    isRowVisible: (row) => !row.hasAttribute('data-hidden'),
                },
                callbacks,
                ac.signal,
            );

            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('cell-0-0');

            // goDown should skip the hidden row and go to row-2
            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should report no navigable items when all rows are hidden', () => {
            const container = createContainer(`
                <div role="grid">
                    <div role="row" data-hidden>
                        <div role="gridcell" id="cell-0-0">A</div>
                    </div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation(
                {
                    ...GRID_OPTIONS,
                    container,
                    isRowVisible: (row) => !row.hasAttribute('data-hidden'),
                },
                callbacks,
                ac.signal,
            );
            expect(nav.hasNavigableItems).toBe(false);
            expect(nav.goToFirst()).toBe(false);
        });

        it('should match Combobox usage pattern (isRowVisible via child attribute)', () => {
            const container = createContainer(`
                <div role="grid">
                    <div role="row" id="row-0">
                        <div role="gridcell" id="cell-0-0">Visible</div>
                    </div>
                    <div role="row" id="row-1">
                        <div role="gridcell" id="cell-1-0" data-filtered>Filtered</div>
                    </div>
                    <div role="row" id="row-2">
                        <div role="gridcell" id="cell-2-0">Visible</div>
                    </div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation(
                {
                    ...GRID_OPTIONS,
                    container,
                    isRowVisible: (row) => !row.querySelector('[role="gridcell"]')?.hasAttribute('data-filtered'),
                },
                callbacks,
                ac.signal,
            );

            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('cell-0-0');

            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-2-0');

            // goToLast should land on the last visible row
            nav.goToLast();
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });
    });

    describe('dynamic DOM changes', () => {
        it('should navigate to a dynamically added row', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToLast();
            expect(nav.activeItem?.id).toBe('cell-1-0');

            // Dynamically add a new row
            const newRow = document.createElement('div');
            newRow.setAttribute('role', 'row');
            newRow.id = 'row-2';
            newRow.innerHTML = '<div role="gridcell" id="cell-2-0">New</div>';
            container.appendChild(newRow);

            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should skip a dynamically removed row', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goToFirst();

            // Remove row-1
            container.querySelector('#row-1')!.remove();

            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });

        it('should update hasNavigableItems after all rows are removed', () => {
            const container = createGrid(1, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.hasNavigableItems).toBe(true);

            container.querySelector('#row-0')!.remove();
            expect(nav.hasNavigableItems).toBe(false);
        });

        it('should reflect dynamically changed row visibility', () => {
            const container = createContainer(`
                <div role="grid">
                    <div role="row" id="row-0">
                        <div role="gridcell" id="cell-0-0">A</div>
                    </div>
                    <div role="row" id="row-1">
                        <div role="gridcell" id="cell-1-0">B</div>
                    </div>
                    <div role="row" id="row-2">
                        <div role="gridcell" id="cell-2-0">C</div>
                    </div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation(
                {
                    ...GRID_OPTIONS,
                    container,
                    isRowVisible: (row) => !row.hasAttribute('data-hidden'),
                },
                callbacks,
                ac.signal,
            );

            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('cell-0-0');

            // Dynamically hide row-1
            container.querySelector('#row-1')!.setAttribute('data-hidden', '');

            nav.goDown();
            expect(nav.activeItem?.id).toBe('cell-2-0');
        });
    });
});
