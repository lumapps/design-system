import {
    createGridFocusNavigation,
    createListFocusNavigation,
    type FocusNavigationController,
} from '../../utils/focusNavigation';
import { isActionCell, isOptionDisabled } from './utils';
import type { ComboboxEventMap, ComboboxHandle } from './types';

/**
 * Set up focus navigation and delegated event listeners on a listbox element.
 *
 * This merges two concerns:
 * 1. Creating the appropriate {@link FocusNavigationController} (grid or list mode)
 *    with callbacks that manage `aria-activedescendant` and visual focus indicators.
 * 2. Attaching delegated `click` and `mousedown` listeners to the listbox for
 *    option selection and blur prevention.
 *
 * The caller is responsible for guarding against duplicate calls (i.e., checking
 * that a focus navigation controller does not already exist before calling)
 * and ensuring `handle.trigger` and `handle.listbox` are non-null.
 *
 * @param handle The combobox handle (provides trigger, listbox, select, etc.).
 * @param signal Abort signal used to clean up all attached listeners.
 * @param notify Notify subscribers of combobox events.
 * @returns The created focus navigation controller.
 */
export function setupListbox(
    handle: ComboboxHandle,
    signal: AbortSignal,
    notify: <K extends keyof ComboboxEventMap>(event: K, value: ComboboxEventMap[K]) => void,
): FocusNavigationController {
    const trigger = handle.trigger!;
    const listbox = handle.listbox!;
    const isGrid = listbox.getAttribute('role') === 'grid';
    const itemSelector = '[role="option"]';

    // ── Focus navigation ──────────────────────────────────────

    const focusCallbacks = {
        onActivate: (item: HTMLElement) => {
            item.setAttribute('data-focus-visible-added', 'true');
            trigger.setAttribute('aria-activedescendant', item.id);
            notify('activeDescendantChange', item.id);

            requestAnimationFrame(() => {
                // Last item in listbox
                const lastItem =
                    !isGrid &&
                    // Last item: find last element containing itemSelector and not followed by elements containing itemSelector and then get the itemSelector inside
                    listbox.querySelector(
                        `:scope > :has(${itemSelector}):not(:has(~ * ${itemSelector})) ${itemSelector}`,
                    );
                if (item === lastItem) {
                    // Scroll to the end of the listbox (shouldsnap to the end of the scroll container thanks to CSS scroll snap)
                    listbox.lastElementChild?.scrollIntoView({ block: 'nearest' });
                } else {
                    // Scroll to the element in listbox or else the item
                    const toScrollTo = item.closest('[role=listbox] > *') || item;
                    toScrollTo.scrollIntoView({ block: 'nearest' });
                }
            });
        },
        onDeactivate: (item: HTMLElement) => {
            item.removeAttribute('data-focus-visible-added');
        },
        onClear: () => {
            trigger.setAttribute('aria-activedescendant', '');
            notify('activeDescendantChange', null);
        },
    };

    let focusNav: FocusNavigationController;

    if (isGrid) {
        focusNav = createGridFocusNavigation(
            {
                type: 'grid',
                container: listbox,
                rowSelector: '[role="row"]',
                cellSelector: '[role="gridcell"]',
                wrap: true,
            },
            focusCallbacks,
            signal,
        );
        trigger.setAttribute('aria-haspopup', 'grid');
    } else {
        focusNav = createListFocusNavigation(
            {
                type: 'list',
                container: listbox,
                itemSelector,
                getActiveItem: () => {
                    const id = trigger.getAttribute('aria-activedescendant');
                    return id ? (document.getElementById(id) as HTMLElement | null) : null;
                },
            },
            focusCallbacks,
            signal,
        );
    }

    // ── Delegated listbox listeners ───────────────────────────

    const cellSelector = isGrid ? '[role="gridcell"]' : '[role="option"]';

    listbox.addEventListener(
        'click',
        (event) => {
            const cell = (event.target as HTMLElement).closest(cellSelector) as HTMLElement | null;
            if (!cell) return;
            // Do not select disabled cells.
            if (isOptionDisabled(cell)) {
                event.stopPropagation();
                return;
            }

            if (isGrid && isActionCell(cell)) {
                // Action cell — skip option selection, let its own handler fire.
                return;
            }

            handle.select(cell);
            trigger.focus();

            // In multi-select mode, keep visual focus on the selected option
            if (!handle.isMultiSelect) {
                handle.setIsOpen(false);
            }
        },
        { signal },
    );

    // Prevent mousedown on cells to avoid blurring the trigger before click fires.
    listbox.addEventListener(
        'mousedown',
        (event) => {
            if ((event.target as HTMLElement).closest(cellSelector)) {
                event.preventDefault();
            }
        },
        { signal },
    );

    return focusNav;
}
