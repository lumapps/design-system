import { createGridFocusNavigation, createListFocusNavigation } from '../../utils/focusNavigation';
import type { CompositeNavigation, CompositeNavigationOptions } from '../Composite/types';
import { isActionCell } from './utils';

const OPTION_SELECTOR = '[role="option"]';
const GRID_CELL_SELECTOR = '[role="gridcell"]';

/** Navigation module for the listbox pattern (1D list of `role="option"`). */
export function createListNavigation(options: CompositeNavigationOptions): CompositeNavigation {
    const { container, callbacks, signal, getActiveItem, wrap } = options;
    const focusNav = createListFocusNavigation(
        { type: 'list', container, itemSelector: OPTION_SELECTOR, wrap, getActiveItem },
        callbacks,
        signal,
    );
    return {
        type: 'listbox',
        focusNav,
        cellSelector: OPTION_SELECTOR,
        isOptionCell: () => true,
        scrollIntoView(item) {
            // Last option: find the last child containing an option (not followed by another one).
            const lastItem = container.querySelector(
                `:scope > :has(${OPTION_SELECTOR}):not(:has(~ * ${OPTION_SELECTOR})) ${OPTION_SELECTOR}`,
            );
            if (item === lastItem) {
                // Scroll to the end of the listbox (snaps to the end of the scroll container via CSS scroll snap)
                container.lastElementChild?.scrollIntoView({ block: 'nearest' });
            } else {
                const toScrollTo = item.closest('[role=listbox] > *') || item;
                toScrollTo.scrollIntoView({ block: 'nearest' });
            }
        },
        navigateHorizontal: () => false,
    };
}

/** Navigation module for the grid pattern (rows of `role="gridcell"`: option cell + action cells). */
export function createGridNavigation(options: CompositeNavigationOptions): CompositeNavigation {
    const { container, callbacks, signal } = options;
    const focusNav = createGridFocusNavigation(
        { type: 'grid', container, rowSelector: '[role="row"]', cellSelector: GRID_CELL_SELECTOR, wrap: true },
        callbacks,
        signal,
    );
    return {
        type: 'grid',
        focusNav,
        cellSelector: GRID_CELL_SELECTOR,
        isOptionCell: (cell) => !isActionCell(cell),
        scrollIntoView(item) {
            item.scrollIntoView({ block: 'nearest' });
        },
        // Move the active cell left/right (only when there is an active cell).
        navigateHorizontal(key) {
            if (!focusNav.selectors.activeItem) return false;
            if (key === 'ArrowLeft') focusNav.goLeft();
            else focusNav.goRight();
            return true;
        },
    };
}
