// @vitest-environment jsdom
import { screen } from '@testing-library/dom';

import { createGridFocusNavigation } from './createGridFocusNavigation';

import type { FocusNavigationCallbacks, FocusNavigationSelectors, GridNavigationDirection } from './types';

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
            expect(nav.selectors.activeItem).toBeNull();
            expect(nav.selectors.activeItem).toBeNull();
        });

        it('should detect navigable items', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.selectors.hasNavigableItems).toBe(true);
        });

        it('should detect no navigable items in empty container', () => {
            const container = createContainer('<div role="grid"></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.selectors.hasNavigableItems).toBe(false);
        });
    });

    describe('goTo getFirst / getLast', () => {
        it('should navigate to first cell (row 0, col 0)', () => {
            const container = createGrid(3, 3);
            const { callbacks, activated } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goTo((s) => s.getFirst())).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
            expect(activated).toHaveLength(1);
        });

        it('should navigate to first cell of last row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goTo((s) => s.getLast())).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('should return false on empty grid', () => {
            const container = createContainer('<div role="grid"></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goTo((s) => s.getFirst())).toBe(false);
            expect(nav.goTo((s) => s.getLast())).toBe(false);
        });
    });

    describe('goDown / goUp (vertical navigation)', () => {
        it('goDown should move to the next row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });

        it('goUp should move to the previous row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getLast());
            expect(nav.goUp()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });

        it('goDown should return false at last row without wrap', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getLast());
            expect(nav.goDown()).toBe(false);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('goUp should return false at first row without wrap', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            expect(nav.goUp()).toBe(false);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
        });

        it('goDown with no active item should go to first row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
        });

        it('goUp with no active item should go to last row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goUp()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });
    });

    describe('column memory', () => {
        it('should remember column when navigating up/down', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Navigate to cell-0-2 (row 0, col 2)
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-2');

            // Go down — should stay in col 2
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-1-2');

            // Go down again — should stay in col 2
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-2-2');
        });

        it('should clamp column when moving to a shorter row', () => {
            const container = createUnevenGrid();
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Navigate to cell-0-2 (row 0 has 3 cells)
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-2');

            // Go down to row 1 (only 1 cell) — col should clamp to 0
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');

            // Go down to row 2 (2 cells) — remembered col is still 2, clamps to 1
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-2-1');
        });

        it('goTo getFirst should reset column memory to 0', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Set column memory to 2
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);

            // goTo getFirst resets column memory
            nav.goTo((s) => s.getFirst());
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');

            // Subsequent goDown should use col 0
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });

        it('goTo getLast should reset column memory to 0', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);

            // Set column memory to 2
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);

            // goTo getLast resets column memory
            nav.goTo((s) => s.getLast());
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');

            // Subsequent goUp should use col 0
            nav.goUp();
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });
    });

    describe('goLeft / goRight (horizontal navigation)', () => {
        it('goRight should move to next cell in the same row', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            expect(nav.goRight()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-1');
        });

        it('goLeft should move to previous cell in the same row', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-1');
        });

        it('goRight should return false at end of row without wrap', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.goRight()).toBe(false);
        });

        it('goLeft should return false at start of row without wrap', () => {
            const container = createGrid(2, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
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
            nav.goTo((s) => s.getFirst());
            nav.goRight();
            nav.goRight();
            expect(nav.selectors.activeItem?.id).toBe('cell-0-2');

            // Column memory should be 2 — goDown should land on col 2
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-1-2');
        });
    });

    describe('wrapping', () => {
        it('goDown should wrap from last row to first', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goTo((s) => s.getLast());
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
        });

        it('goUp should wrap from first row to last', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            expect(nav.goUp()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('goRight should wrap to first cell of next row', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-0-1') as HTMLElement);
            expect(nav.goRight()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });

        it('goLeft should wrap to last cell of previous row', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-1-0') as HTMLElement);
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-1');
        });

        it('goRight should wrap from last cell of last row to first cell of first row', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-1-1') as HTMLElement);
            expect(nav.goRight()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
        });

        it('goLeft should wrap from first cell of first row to last cell of last row', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container, wrap: true }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-1');
        });
    });

    describe('goTo with item selector', () => {
        it('should navigate to a specific cell', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            const cell = container.querySelector('#cell-1-2') as HTMLElement;
            expect(nav.goTo(() => cell)).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-2');
        });

        it('should update column memory', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);

            // Column memory should be 2
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-1-2');
        });

        it('should return false for element not in the grid', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            const outsider = document.createElement('div');
            expect(nav.goTo(() => outsider)).toBe(false);
        });
    });

    describe('goTo with getMatching', () => {
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
            expect(nav.goTo((n) => n.getMatching((el) => el.getAttribute('aria-selected') === 'true'))).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-1');
        });

        it('should defer when no cell matches', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goTo((n) => n.getMatching(() => false))).toBe(false);
            expect(nav.selectors.activeItem).toBeNull();
        });

        it('should update column memory to matched cell column', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((n) => n.getMatching((el) => el.id === 'cell-1-2'));
            expect(nav.selectors.activeItem?.id).toBe('cell-1-2');

            // Column memory should be 2
            nav.goDown();
            expect(nav.selectors.activeItem?.id).toBe('cell-2-2');
        });
    });

    describe('goToOffset', () => {
        it('should navigate forward by row offset', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            expect(nav.goToOffset(2)).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('should navigate backward by row offset', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getLast());
            expect(nav.goToOffset(-2)).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('should clamp at boundaries', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getLast());
            expect(nav.goToOffset(5)).toBe(false);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('should start from first row when no active item and offset is positive', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToOffset(1)).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
        });

        it('should start from last row when no active item and offset is negative', () => {
            const container = createGrid(5, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToOffset(-1)).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-4-0');
        });

        it('should respect column memory with offset', () => {
            const container = createGrid(5, 3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo(() => container.querySelector('#cell-0-2') as HTMLElement);
            expect(nav.goToOffset(3)).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-3-2');
        });

        it('offset 0 should return true if active item exists, false otherwise', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.goToOffset(0)).toBe(false);
            nav.goTo((s) => s.getFirst());
            expect(nav.goToOffset(0)).toBe(true);
        });
    });

    describe('clear', () => {
        it('should clear active item and call onClear', () => {
            const container = createGrid(2, 2);
            const { callbacks, deactivated, counter } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());
            nav.clear();
            expect(nav.selectors.activeItem).toBeNull();
            expect(nav.selectors.activeItem).toBeNull();
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
            nav.goTo((s) => s.getFirst());
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
            nav.goTo((s) => s.getFirst());
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
            nav.goTo((s) => s.getFirst());
            ac.abort();
            expect(nav.selectors.activeItem).toBeNull();
            expect(deactivated).toHaveLength(1);
            expect(counter.clearCount).toBe(1);
        });
    });

    describe('dynamic DOM changes', () => {
        it('should navigate to a dynamically added row', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getLast());
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');

            // Dynamically add a new row
            const newRow = document.createElement('div');
            newRow.setAttribute('role', 'row');
            newRow.id = 'row-2';
            newRow.innerHTML = '<div role="gridcell" id="cell-2-0">New</div>';
            container.appendChild(newRow);

            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('should skip a dynamically removed row', () => {
            const container = createGrid(3, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            nav.goTo((s) => s.getFirst());

            // Remove row-1
            container.querySelector('#row-1')!.remove();

            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-2-0');
        });

        it('should update hasNavigableItems after all rows are removed', () => {
            const container = createGrid(1, 2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
            expect(nav.selectors.hasNavigableItems).toBe(true);

            container.querySelector('#row-0')!.remove();
            expect(nav.selectors.hasNavigableItems).toBe(false);
        });
    });

    describe('resolve-based navigation (goTo)', () => {
        const makeNav = (container: HTMLElement, ac: AbortController) => {
            const { callbacks } = makeCallbacks();
            return createGridFocusNavigation({ ...GRID_OPTIONS, container }, callbacks, ac.signal);
        };

        it('should expose read accessors without moving focus', () => {
            const container = createGrid(2, 2);
            const ac = new AbortController();
            const nav = makeNav(container, ac);

            expect(nav.selectors.getFirst()?.id).toBe('cell-0-0');
            expect(nav.selectors.getLast()?.id).toBe('cell-1-0');
            expect(nav.selectors.getMatching((el) => el.id === 'cell-1-1')?.id).toBe('cell-1-1');
            expect(nav.selectors.activeItem).toBeNull();
        });

        it('should resolve and move focus immediately when the target exists', () => {
            const container = createGrid(2, 2);
            const ac = new AbortController();
            const nav = makeNav(container, ac);

            const moved = nav.goTo((n) => n.getFirst());
            expect(moved).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-0-0');
        });

        it('should defer and retry until rows are available', () => {
            // Start with an empty grid so the resolver returns null.
            const container = createContainer('<div role="grid"></div>');
            const ac = new AbortController();
            const nav = makeNav(container, ac);

            const moved = nav.goTo((n) => n.getFirst());
            expect(moved).toBe(false);
            expect(nav.selectors.activeItem).toBeNull();

            // A row with a cell mounts, then flush.
            container.innerHTML = '<div role="row" id="late-row"><div role="gridcell" id="late-cell">X</div></div>';

            nav.flushPendingNavigation();
            expect(nav.selectors.activeItem?.id).toBe('late-cell');
        });

        it('should discard a deferred intent on clear', () => {
            const container = createContainer('<div role="grid"></div>');
            const ac = new AbortController();
            const nav = makeNav(container, ac);

            const resolve = vi.fn((n: FocusNavigationSelectors) => n.getFirst());
            nav.goTo(resolve);

            nav.clear();

            // After clear, a flush must not replay the intent — even once cells exist.
            container.innerHTML = '<div role="row" id="late-row"><div role="gridcell" id="late-cell">X</div></div>';
            resolve.mockClear();
            nav.flushPendingNavigation();
            expect(resolve).not.toHaveBeenCalled();
            expect(nav.selectors.activeItem).toBeNull();
        });
    });

    /**
     * Grid with non-navigable cells (4 columns by position):
     * ```
     * row 0: [blank] [blank]  A      B
     * row 1:  C      (D)      E      F
     * row 2:  G       H       I    [blank]
     * ```
     * `[blank]` are blank cells, `(D)` is a disabled cell.
     */
    function createGridWithBlankCells(): HTMLElement {
        return createContainer(`
            <div role="grid">
                <div role="row">
                    <div role="gridcell" data-blank data-testid="blank-0-0"></div>
                    <div role="gridcell" data-blank data-testid="blank-0-1"></div>
                    <div role="gridcell">A</div>
                    <div role="gridcell">B</div>
                </div>
                <div role="row">
                    <div role="gridcell">C</div>
                    <div role="gridcell" aria-disabled="true">D</div>
                    <div role="gridcell">E</div>
                    <div role="gridcell">F</div>
                </div>
                <div role="row">
                    <div role="gridcell">G</div>
                    <div role="gridcell">H</div>
                    <div role="gridcell">I</div>
                    <div role="gridcell" data-blank data-testid="blank-2-3"></div>
                </div>
            </div>
        `);
    }

    const BLANK_GRID_OPTIONS = {
        ...GRID_OPTIONS,
        cellDisabledSelector: '[aria-disabled="true"], [data-blank]',
    };

    describe('non-navigable cells (cellDisabledSelector)', () => {
        it('should resolve first/last/matching to navigable cells only', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            expect(nav.selectors.getFirst()).toBe(screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.selectors.getLast()).toBe(screen.getByRole('gridcell', { name: 'G' }));
            expect(nav.selectors.getMatching(() => true)).toBe(screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.selectors.getMatching((cell) => cell.textContent === 'D')).toBeNull();
            expect(nav.selectors.hasNavigableItems).toBe(true);
        });

        it('should report no navigable items when every cell is non-navigable', () => {
            const container = createContainer(`
                <div role="grid">
                    <div role="row"><div role="gridcell" data-blank></div><div role="gridcell" aria-disabled="true">X</div></div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );
            expect(nav.selectors.hasNavigableItems).toBe(false);
            expect(nav.goDown()).toBe(false);
            expect(nav.selectors.activeItem).toBeNull();
        });

        it('should not activate a non-navigable cell with goTo', () => {
            const container = createGridWithBlankCells();
            const { callbacks, activated } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            expect(nav.goTo(() => screen.getByRole('gridcell', { name: 'D' }))).toBe(false);
            expect(nav.goTo(() => screen.getByTestId('blank-0-0'))).toBe(false);
            expect(activated).toHaveLength(0);
        });

        it('should go down from the first row into the column of its first navigable cell (position index)', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            // No active cell: first navigable cell of the first row.
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'A' }));

            // A is at position 2 (blank cells count): down goes to E, then I.
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'E' }));
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'I' }));
        });

        it('should skip non-navigable cells when moving left/right in a row', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'C' }));
            expect(nav.goRight()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'E' }));
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'C' }));
        });

        it('should not move left past the leading blank cells (no wrap)', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.goLeft()).toBe(false);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'A' }));
        });

        it('should wrap left/right to the navigable cells of the adjacent rows (wrap)', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container, wrap: true },
                callbacks,
                new AbortController().signal,
            );

            // Left from A: past the leading blanks, wraps to the last navigable cell of the last row.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'I' }));

            // Right from I: past the trailing blank, wraps to the first navigable cell of the first row.
            expect(nav.goRight()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'A' }));

            // Left from C: wraps to the last navigable cell of the previous row.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'C' }));
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'B' }));
        });

        it('should not move up/down onto a non-navigable cell', () => {
            const container = createGridWithBlankCells();
            const { callbacks, activated } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container, wrap: true },
                callbacks,
                new AbortController().signal,
            );

            // Up from C targets the blank cell at position 0.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'C' }));
            activated.length = 0;
            expect(nav.goUp()).toBe(false);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'C' }));

            // Up from H targets the disabled D.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'H' }));
            activated.length = 0;
            expect(nav.goUp()).toBe(false);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'H' }));

            // Down from F targets the trailing blank cell.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'F' }));
            activated.length = 0;
            expect(nav.goDown()).toBe(false);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'F' }));
            expect(activated).toHaveLength(0);
        });

        it('should keep the position index in the column memory', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            // C (position 0) -> Right skips D -> E (position 2) -> Up -> A (position 2).
            nav.goTo(() => screen.getByRole('gridcell', { name: 'C' }));
            nav.goRight();
            expect(nav.goUp()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'A' }));

            // B (position 3) -> Down -> F (position 3).
            nav.goTo(() => screen.getByRole('gridcell', { name: 'B' }));
            expect(nav.goDown()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'F' }));
        });
    });

    describe('goToRowStart / goToRowEnd', () => {
        it('should move to the first/last cell of the active row', () => {
            const container = createGrid(3, 3);
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => container.querySelector<HTMLElement>('#cell-1-1'));
            expect(nav.goToRowEnd()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-2');
            expect(nav.goToRowStart()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });

        it('should skip non-navigable cells at the row edges', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'B' }));
            expect(nav.goToRowStart()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'A' }));

            nav.goTo(() => screen.getByRole('gridcell', { name: 'G' }));
            expect(nav.goToRowEnd()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'I' }));
        });

        it('should update the column memory', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            // G -> row end I (position 2) -> Up -> E.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'G' }));
            nav.goToRowEnd();
            expect(nav.goUp()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'E' }));
        });

        it('should return false with no active cell', () => {
            const container = createGrid(2, 2);
            const { callbacks, activated } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...GRID_OPTIONS, container },
                callbacks,
                new AbortController().signal,
            );

            expect(nav.goToRowStart()).toBe(false);
            expect(nav.goToRowEnd()).toBe(false);
            expect(activated).toHaveLength(0);
        });
    });

    describe('onBoundary', () => {
        it('should be called past the first/last row with the remembered column', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const onBoundary = vi.fn(() => false);
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container, onBoundary },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.goUp()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('up', screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'A' }));

            nav.goTo(() => screen.getByRole('gridcell', { name: 'H' }));
            expect(nav.goDown()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('down', screen.getByRole('gridcell', { name: 'H' }));
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'H' }));
        });

        it('should be called on an up/down move onto a non-navigable cell', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const onBoundary = vi.fn(() => false);
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container, onBoundary },
                callbacks,
                new AbortController().signal,
            );

            // Up from C lands on the leading blank cell.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'C' }));
            expect(nav.goUp()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('up', screen.getByRole('gridcell', { name: 'C' }));

            // Up from H lands on the disabled D.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'H' }));
            expect(nav.goUp()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('up', screen.getByRole('gridcell', { name: 'H' }));
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'H' }));
        });

        it('should be called past the first/last navigable cell of the row', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const onBoundary = vi.fn(() => false);
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container, onBoundary },
                callbacks,
                new AbortController().signal,
            );

            // Left from A: past the leading blank cells.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'A' }));
            expect(nav.goLeft()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('left', screen.getByRole('gridcell', { name: 'A' }));

            // Right from I: past the trailing blank cell.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'I' }));
            expect(nav.goRight()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('right', screen.getByRole('gridcell', { name: 'I' }));

            // Right from F: last cell of a middle row.
            nav.goTo(() => screen.getByRole('gridcell', { name: 'F' }));
            expect(nav.goRight()).toBe(false);
            expect(onBoundary).toHaveBeenLastCalledWith('right', screen.getByRole('gridcell', { name: 'F' }));
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'F' }));
        });

        it('should not be called when the move stays inside the grid', () => {
            const container = createGridWithBlankCells();
            const { callbacks } = makeCallbacks();
            const onBoundary = vi.fn(() => false);
            const nav = createGridFocusNavigation(
                { ...BLANK_GRID_OPTIONS, container, onBoundary },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'C' }));
            nav.goRight();
            nav.goDown();
            nav.goLeft();
            nav.goToRowStart();
            nav.goToRowEnd();
            expect(onBoundary).not.toHaveBeenCalled();
        });

        it('should replace wrap', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const onBoundary = vi.fn(() => false);
            const nav = createGridFocusNavigation(
                { ...GRID_OPTIONS, container, wrap: true, onBoundary },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => container.querySelector<HTMLElement>('#cell-1-1'));
            expect(nav.goDown()).toBe(false);
            expect(nav.goRight()).toBe(false);
            expect(onBoundary).toHaveBeenCalledTimes(2);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-1');
        });

        it('should report the move as handled when it returns true, without moving', () => {
            const container = createGrid(2, 2);
            const { callbacks, activated } = makeCallbacks();
            const nav = createGridFocusNavigation(
                { ...GRID_OPTIONS, container, onBoundary: () => true },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => container.querySelector<HTMLElement>('#cell-1-1'));
            activated.length = 0;
            expect(nav.goDown()).toBe(true);
            expect(activated).toHaveLength(0);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-1');
        });

        it('should move at once when the consumer goes to a target already in the DOM', () => {
            const container = createGrid(2, 2);
            const { callbacks } = makeCallbacks();
            const nav = createGridFocusNavigation(
                {
                    ...GRID_OPTIONS,
                    container,
                    // Right past the row end: go to the first cell of the next row.
                    onBoundary: () => nav.goTo(() => container.querySelector<HTMLElement>('#cell-1-0')),
                },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => container.querySelector<HTMLElement>('#cell-0-1'));
            expect(nav.goRight()).toBe(true);
            expect(nav.selectors.activeItem?.id).toBe('cell-1-0');
        });

        it('should defer the consumer goTo until flushPendingNavigation after the DOM change', () => {
            const container = createGridWithBlankCells();
            const { callbacks, activated } = makeCallbacks();
            const onBoundarySpy = vi.fn();
            const nav = createGridFocusNavigation(
                {
                    ...BLANK_GRID_OPTIONS,
                    container,
                    onBoundary(direction: GridNavigationDirection, activeCell: HTMLElement) {
                        onBoundarySpy(direction, activeCell);
                        // The consumer renders the next page later, and asks for the cell at the same column.
                        const column = Array.from(activeCell.parentElement?.children ?? []).indexOf(activeCell);
                        nav.goTo(
                            () =>
                                container.querySelectorAll<HTMLElement>('#next-page [role="gridcell"]')[column] ?? null,
                        );
                        return true;
                    },
                },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'H' }));
            activated.length = 0;

            // Down past the last row: handled, but the target is not rendered yet.
            expect(nav.goDown()).toBe(true);
            expect(onBoundarySpy).toHaveBeenCalledWith('down', screen.getByRole('gridcell', { name: 'H' }));
            expect(activated).toHaveLength(0);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'H' }));

            // A flush before the render keeps the intent.
            nav.flushPendingNavigation();
            expect(activated).toHaveLength(0);

            // Render the next page, then flush: the deferred goTo resolves.
            container.innerHTML = `
                <div role="row" id="next-page">
                    <div role="gridcell">J</div>
                    <div role="gridcell">K</div>
                </div>
            `;
            nav.flushPendingNavigation();
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'K' }));
            expect(activated).toEqual([screen.getByRole('gridcell', { name: 'K' })]);

            // The intent is consumed: a later flush does nothing.
            nav.flushPendingNavigation();
            expect(activated).toHaveLength(1);
        });

        it('should drop the pending goTo on a newer move', () => {
            const container = createGridWithBlankCells();
            const { callbacks, activated } = makeCallbacks();
            const nav = createGridFocusNavigation(
                {
                    ...BLANK_GRID_OPTIONS,
                    container,
                    onBoundary: () => {
                        nav.goTo(() => container.querySelector<HTMLElement>('#next-page [role="gridcell"]'));
                        return true;
                    },
                },
                callbacks,
                new AbortController().signal,
            );

            nav.goTo(() => screen.getByRole('gridcell', { name: 'H' }));
            // Down past the last row: pending.
            expect(nav.goDown()).toBe(true);
            // A newer move in the grid wins.
            expect(nav.goLeft()).toBe(true);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'G' }));
            activated.length = 0;

            // The next page is rendered later: the dropped goTo does not move.
            container.insertAdjacentHTML(
                'beforeend',
                '<div role="row" id="next-page"><div role="gridcell">J</div></div>',
            );
            nav.flushPendingNavigation();
            expect(activated).toHaveLength(0);
            expect(nav.selectors.activeItem).toBe(screen.getByRole('gridcell', { name: 'G' }));
        });
    });
});
