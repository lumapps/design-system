import {
    createGridFocusNavigation,
    createListFocusNavigation,
    type FocusNavigationCallbacks,
    type FocusNavigationController,
} from '../../utils/focusNavigation';
import { isActionCell } from './utils';

/** Options shared by the list and grid navigation modules. */
interface NavigationOptions {
    /** The mounted listbox (or grid) element. */
    container: HTMLElement;
    /** Focus state change callbacks (visual focus + `aria-activedescendant`). */
    callbacks: FocusNavigationCallbacks;
    /** Abort signal (unmount). */
    signal: AbortSignal;
    /** Read the active item (from the focus owner `aria-activedescendant`). */
    getActiveItem: () => HTMLElement | null;
    /** When true, ArrowDown/ArrowUp wrap around (list mode only). */
    wrap?: boolean;
}

/**
 * Navigation module of a mounted listbox: everything that differs between
 * the listbox pattern (`role="listbox"`) and the grid pattern (`role="grid"`).
 */
export interface ListboxNavigation {
    /** Pattern of the mounted element. */
    readonly type: 'listbox' | 'grid';
    /** The focus navigation controller. */
    readonly focusNav: FocusNavigationController;
    /** Selector of the elements that can become active (options, or grid cells). */
    readonly cellSelector: string;
    /** Whether a clicked cell selects its option (false for grid action cells). */
    isOptionCell(cell: HTMLElement): boolean;
    /** Scroll the active item into view. */
    scrollIntoView(item: HTMLElement): void;
    /**
     * Move the active cell left/right (grid only, when there is an active cell).
     * Returns true when the key was handled (grid with an active cell), even at the row edge.
     */
    navigateHorizontal(key: 'ArrowLeft' | 'ArrowRight'): boolean;
}

const OPTION_SELECTOR = '[role="option"]';
const GRID_CELL_SELECTOR = '[role="gridcell"]';

/** Navigation module for the listbox pattern (1D list of `role="option"`). */
export function createListNavigation(options: NavigationOptions): ListboxNavigation {
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
export function createGridNavigation(options: NavigationOptions): ListboxNavigation {
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
        navigateHorizontal(key) {
            if (!focusNav.selectors.activeItem) return false;
            if (key === 'ArrowLeft') focusNav.goLeft();
            else focusNav.goRight();
            return true;
        },
    };
}
