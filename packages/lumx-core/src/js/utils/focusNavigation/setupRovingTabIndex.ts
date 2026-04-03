import { querySelectorInclusive } from '../browser/querySelectorInclusive';
import { trackContainerFocus } from '../browser/trackContainerFocus';
import { createListFocusNavigation } from './createListFocusNavigation';
import type { FocusNavigationController } from './types';

/** Options for {@link setupRovingTabIndex}. */
export interface RovingTabIndexOptions {
    /** Container element holding the focusable items. */
    container: HTMLElement;
    /** CSS selector identifying focusable items within the container. */
    itemSelector: string;
    /**
     * Navigation axis — determines which arrow keys navigate.
     * - `'horizontal'` (default): Left/Right navigate.
     * - `'vertical'`: Up/Down navigate.
     */
    direction?: 'horizontal' | 'vertical';
    /** CSS selector matching disabled items (skipped during navigation). */
    itemDisabledSelector?: string;
    /**
     * Attribute name indicating the selected item (e.g. `'aria-selected'`, `'aria-checked'`).
     * When set, the roving tabindex will observe changes to this attribute and keep
     * `tabindex="0"` in sync with the item whose attribute value is `"true"`.
     * Default: `'aria-selected'`.
     */
    itemSelectedAttr?: string;
    /** Called when an item receives focus via keyboard navigation. */
    onItemFocused?: (item: HTMLElement) => void;
}

/**
 * Set up the roving tabindex pattern on a container element.
 *
 * - Keyboard navigation (Arrow keys, Home, End)
 * - tabindex management (`0` on active, `-1` on others)
 * - Mount normalization (single-tabstop invariant)
 * - DOM mutation handling via MutationObserver:
 *   removal recovery, insertion normalization, disabled-state changes
 *
 * Torn down when `signal` is aborted.
 */
export function setupRovingTabIndex(options: RovingTabIndexOptions, signal: AbortSignal): FocusNavigationController {
    const {
        container,
        itemSelector,
        direction = 'horizontal',
        itemDisabledSelector,
        itemSelectedAttr = 'aria-selected',
        onItemFocused,
    } = options;

    const itemActiveSelector = `${itemSelector}[tabindex="0"]`;

    // Item selected selector
    let itemSelectedSelector = `${itemSelector}[${itemSelectedAttr}=true]`;
    if (itemDisabledSelector) itemSelectedSelector += `:not(${itemDisabledSelector})`;

    // Track focus inside container
    const containerFocus = trackContainerFocus(container, signal);

    const nav = createListFocusNavigation(
        {
            type: 'list',
            container,
            itemSelector,
            direction,
            wrap: true,
            itemDisabledSelector,
            getActiveItem: () => container.querySelector<HTMLElement>(itemActiveSelector),
        },
        {
            onActivate(item: HTMLElement) {
                item.setAttribute('tabindex', '0');
                item.focus();
                onItemFocused?.(item);
            },
            onDeactivate(item: HTMLElement) {
                item.setAttribute('tabindex', '-1');
            },
        },
        signal,
    );

    // ─── tabindex normalization ────────────────────────────────────

    /** Set tabindex only when the value actually changes to avoid unnecessary DOM mutations. */
    function setTabIndex(item: HTMLElement, value: '0' | '-1'): void {
        if (item.getAttribute('tabindex') !== value) {
            item.setAttribute('tabindex', value);
        }
    }

    /** Assign tabindex across `items`, ensuring at most one `tabindex="0"` */
    function normalizeItems(items: HTMLElement[], hasExistingTabStop: boolean): void {
        let hasTabStop = hasExistingTabStop;

        for (const item of items) {
            if (!container.contains(item)) continue;
            const isDisabled = itemDisabledSelector ? item.matches(itemDisabledSelector) : false;

            if (!isDisabled && !hasTabStop) {
                setTabIndex(item, '0');
                hasTabStop = true;
            } else {
                setTabIndex(item, '-1');
            }
        }

        if (!hasTabStop) {
            const fallback = container.querySelector<HTMLElement>(nav.enabledItemSelector);
            if (fallback) setTabIndex(fallback, '0');
        }
    }

    /** Enforce the single-tabstop invariant across all items. */
    function normalizeAllItems(): void {
        const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
        const { activeItem } = nav;

        // Prefer either the current active item (from DOM) or the current selected item
        let preferredTabStopIndex = activeItem && items.indexOf(activeItem);
        if (!preferredTabStopIndex || preferredTabStopIndex === -1) {
            preferredTabStopIndex = items.findIndex((item) => item.matches(itemSelectedSelector));
        }
        if (preferredTabStopIndex && preferredTabStopIndex > 0) {
            const [preferredItem] = items.splice(preferredTabStopIndex, 1);
            items.unshift(preferredItem);
        }
        normalizeItems(items, false);
    }

    /** Ensure a tab stop exists; find a fallback near `anchor` and optionally move focus to it. */
    function ensureTabStop(shouldFocus: boolean, anchor?: Node | null): void {
        if (container.querySelector(itemActiveSelector)) return;
        const fallback =
            (anchor && nav.findNearestEnabled(anchor)) ?? container.querySelector<HTMLElement>(nav.enabledItemSelector);
        if (!fallback) return;
        if (shouldFocus) {
            nav.goToItem(fallback);
        } else {
            setTabIndex(fallback, '0');
        }
    }

    normalizeAllItems();

    // ─── MutationObserver ──────────────────────────────────────────

    const observer = new MutationObserver((mutations) => {
        // Track removed
        let removedActiveItem: HTMLElement | null = null;
        let removalAnchor: Node | null = null;
        // Track selected
        let newSelectedItem: HTMLElement | null = null;
        // Track disabled
        const disabledTargets: HTMLElement[] = [];
        // Track added
        const insertedItems: HTMLElement[] = [];

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Track removed — scan removed nodes for the active item (tabindex="0").
                // We cannot gate this on a live DOM query because the item is already removed.
                if (!removedActiveItem) {
                    for (const removedNode of mutation.removedNodes) {
                        const { value: firstMatch } = querySelectorInclusive(removedNode, itemActiveSelector).next();
                        if (firstMatch) {
                            removedActiveItem = firstMatch;
                            removalAnchor = mutation.nextSibling ?? mutation.previousSibling ?? null;
                            break;
                        }
                    }
                }

                // Track added
                for (const addedNode of mutation.addedNodes) {
                    for (const item of querySelectorInclusive(addedNode, itemSelector)) {
                        insertedItems.push(item);
                    }
                }
            }

            const target = mutation.target as HTMLElement;
            if (mutation.type === 'attributes' && target.matches(itemSelector)) {
                if (mutation.attributeName === itemSelectedAttr && target.getAttribute(itemSelectedAttr) === 'true') {
                    // Track selected item
                    newSelectedItem = target;
                } else if (itemDisabledSelector && target.matches(itemDisabledSelector)) {
                    // Track disabled items
                    disabledTargets.push(target);
                }
            }
        }

        // Handle removed item
        if (removedActiveItem) {
            const shouldMoveFocus = containerFocus.hasFocus;
            containerFocus.reset();
            ensureTabStop(shouldMoveFocus, removalAnchor);
        }

        // Handle inserted items
        if (insertedItems.length > 0) {
            const hasTabStop = container.querySelector<HTMLElement>(itemActiveSelector) !== null;
            normalizeItems(insertedItems, hasTabStop);
        }

        // Handle disabled
        if (disabledTargets.length > 0) {
            const currentActive = nav.activeItem;
            for (const target of disabledTargets) {
                setTabIndex(target, '-1');
            }

            const activeItemDisabled = currentActive && disabledTargets.includes(currentActive);
            const shouldFocus = !!(activeItemDisabled && containerFocus.hasFocus);
            ensureTabStop(shouldFocus);
        }

        // Handle selected
        if (newSelectedItem) {
            // Demote previous item
            const currentTabStop = container.querySelector<HTMLElement>(itemActiveSelector);
            if (currentTabStop && currentTabStop !== newSelectedItem) {
                setTabIndex(currentTabStop, '-1');
            }
            // Selected item is the new default focuable item
            setTabIndex(newSelectedItem, '0');
        }
    });

    observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-disabled', 'disabled', itemSelectedAttr],
    });
    signal.addEventListener('abort', () => observer.disconnect());

    // ─── Keyboard navigation ───────────────────────────────────────

    container.addEventListener(
        'keydown',
        (evt: KeyboardEvent) => {
            // Adopt focus target if nothing is active yet.
            if (!nav.activeItem) {
                const target = evt.target as HTMLElement;
                if (target.matches(itemSelector) && container.contains(target)) {
                    nav.goToItem(target);
                }
            }

            let handled = false;
            switch (evt.key) {
                case 'ArrowRight':
                    handled = nav.goRight();
                    break;
                case 'ArrowLeft':
                    handled = nav.goLeft();
                    break;
                case 'ArrowDown':
                    handled = nav.goDown();
                    break;
                case 'ArrowUp':
                    handled = nav.goUp();
                    break;
                case 'Home':
                    handled = nav.goToFirst();
                    break;
                case 'End':
                    handled = nav.goToLast();
                    break;
                default:
                    break;
            }

            if (handled) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        },
        { signal },
    );

    return nav;
}
