import { querySelectorInclusive } from '../browser/querySelectorInclusive';
import { trackContainerFocus } from '../browser/trackContainerFocus';
import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';
import { createGridFocusNavigation } from './createGridFocusNavigation';
import { createListFocusNavigation } from './createListFocusNavigation';
import type {
    FocusNavigationCallbacks,
    FocusNavigationController,
    GridFocusNavigationController,
    GridNavigationOptions,
} from './types';

/** Options shared by the list and grid modes of {@link setupRovingTabIndex}. */
interface BaseRovingTabIndexOptions {
    /** Container element holding the focusable items. */
    container: HTMLElement;
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

/** Options for {@link setupRovingTabIndex} (list mode). */
export interface RovingTabIndexOptions extends BaseRovingTabIndexOptions {
    /** List mode (default). */
    type?: 'list';
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
}

/**
 * Options for {@link setupRovingTabIndex} (grid mode).
 * See {@link GridNavigationOptions} for the navigation rules (columns by position, non-navigable cells,
 * boundary callback).
 */
export interface GridRovingTabIndexOptions
    extends BaseRovingTabIndexOptions,
        Pick<GridNavigationOptions, 'rowSelector' | 'cellSelector' | 'cellDisabledSelector' | 'onBoundary'> {
    /** Grid mode. */
    type: 'grid';
    /**
     * Who writes the `tabindex` of the cells.
     * - `'managed'` (default): this module keeps a single `tabindex="0"` cell (moves, mount normalization,
     *   DOM mutations, `itemSelectedAttr` sync).
     * - `'rendered'`: the consumer renders the tab stop (`tabindex="0"` on one cell, `-1` on the others) and
     *   moves it from `onItemFocused`. This module only moves focus: it never writes `tabindex` and does not
     *   observe the DOM (`itemSelectedAttr` is ignored).
     */
    tabStop?: 'managed' | 'rendered';
}

/**
 * Set up the roving tabindex pattern on a container element.
 *
 * - Keyboard navigation
 *   - List mode: Arrow keys (on the `direction` axis, wrapping), Home, End.
 *   - Grid mode: Arrow keys (no wrap, `onBoundary` at the edges), Home/End (first/last navigable cell of the
 *     row), Ctrl+Home/Ctrl+End (first navigable cell of the first row / last navigable cell of the last row).
 *     The grid consumes these keys even when focus cannot move (no page scroll at the grid edges). It does
 *     not handle other keys (e.g. Page Up/Down) nor arrows with a modifier: they propagate.
 * - tabindex management (`0` on active, `-1` on others)
 * - Mount normalization (single-tabstop invariant)
 * - DOM mutation handling via MutationObserver:
 *   removal recovery, insertion normalization, disabled-state changes
 *
 * In grid mode with `tabStop: 'rendered'`, only the keyboard navigation is set up: the consumer renders the
 * tab stop (see {@link GridRovingTabIndexOptions.tabStop}).
 *
 * Torn down when `signal` is aborted.
 */
export function setupRovingTabIndex(options: RovingTabIndexOptions, signal: AbortSignal): FocusNavigationController;
export function setupRovingTabIndex(
    options: GridRovingTabIndexOptions,
    signal: AbortSignal,
): GridFocusNavigationController;
export function setupRovingTabIndex(
    options: RovingTabIndexOptions | GridRovingTabIndexOptions,
    signal: AbortSignal,
): FocusNavigationController {
    const { container, itemSelectedAttr = 'aria-selected', onItemFocused } = options;
    const itemSelector = options.type === 'grid' ? options.cellSelector : options.itemSelector;
    const itemDisabledSelector = options.type === 'grid' ? options.cellDisabledSelector : options.itemDisabledSelector;

    const itemActiveSelector = `${itemSelector}[tabindex="0"]`;
    const enabledItemSelector = itemDisabledSelector ? `${itemSelector}:not(${itemDisabledSelector})` : itemSelector;
    // The consumer renders the tab stop: never write `tabindex`.
    const isTabStopRendered = options.type === 'grid' && options.tabStop === 'rendered';

    // Item selected selector
    let itemSelectedSelector = `${itemSelector}[${itemSelectedAttr}=true]`;
    if (itemDisabledSelector) itemSelectedSelector += `:not(${itemDisabledSelector})`;

    const callbacks: FocusNavigationCallbacks = {
        onActivate(item: HTMLElement) {
            if (!isTabStopRendered) item.setAttribute('tabindex', '0');
            item.focus();
            onItemFocused?.(item);
        },
        onDeactivate(item: HTMLElement) {
            if (!isTabStopRendered) item.setAttribute('tabindex', '-1');
        },
    };

    let nav: FocusNavigationController;
    let gridNav: GridFocusNavigationController | null = null;
    let gridRowSelector = '';
    if (options.type === 'grid') {
        const { rowSelector, cellSelector, cellDisabledSelector, onBoundary } = options;
        gridRowSelector = rowSelector;
        gridNav = createGridFocusNavigation(
            { type: 'grid', container, rowSelector, cellSelector, cellDisabledSelector, onBoundary },
            callbacks,
            signal,
        );
        nav = gridNav;
    } else {
        nav = createListFocusNavigation(
            {
                type: 'list',
                container,
                itemSelector,
                direction: options.direction ?? 'horizontal',
                wrap: true,
                itemDisabledSelector,
                getActiveItem: () => container.querySelector<HTMLElement>(itemActiveSelector),
            },
            callbacks,
            signal,
        );
    }

    // ─── Keyboard navigation ───────────────────────────────────────

    /** List mode keys. Returns true when the key moved focus. */
    function handleListKey(evt: KeyboardEvent): boolean {
        // Adopt focus target if nothing is active yet.
        if (!nav.selectors.activeItem) {
            const target = evt.target as HTMLElement;
            if (target.matches(itemSelector) && container.contains(target)) {
                nav.goTo(() => target);
            }
        }

        switch (evt.key) {
            case 'ArrowRight':
                return nav.goRight();
            case 'ArrowLeft':
                return nav.goLeft();
            case 'ArrowDown':
                return nav.goDown();
            case 'ArrowUp':
                return nav.goUp();
            case 'Home':
                return nav.goTo((s) => s.getFirst());
            case 'End':
                return nav.goTo((s) => s.getLast());
            default:
                return false;
        }
    }

    /** Grid mode keys. Returns true when the key is a grid key (even when focus could not move). */
    function handleGridKey(grid: GridFocusNavigationController, rowSelector: string, evt: KeyboardEvent): boolean {
        if (evt.altKey || evt.metaKey || evt.shiftKey) return false;

        let move: (() => boolean) | undefined;
        if (evt.ctrlKey) {
            if (evt.key === 'Home') {
                move = () => grid.goTo((s) => s.getFirst());
            } else if (evt.key === 'End') {
                // Last navigable cell of the last row.
                move = () =>
                    grid.goTo((s) => {
                        const lastRow = s.getLast()?.closest(rowSelector);
                        const cells = lastRow?.querySelectorAll<HTMLElement>(enabledItemSelector);
                        return cells?.length ? cells[cells.length - 1] : null;
                    });
            }
        } else {
            const keyMoves: Record<string, () => boolean> = {
                ArrowRight: () => grid.goRight(),
                ArrowLeft: () => grid.goLeft(),
                ArrowDown: () => grid.goDown(),
                ArrowUp: () => grid.goUp(),
                Home: () => grid.goToRowStart(),
                End: () => grid.goToRowEnd(),
            };
            move = Object.prototype.hasOwnProperty.call(keyMoves, evt.key) ? keyMoves[evt.key] : undefined;
        }
        if (!move) return false;

        // Adopt the focused cell if it is not the active one (e.g. focused with a click or with Tab).
        const target = evt.target as HTMLElement;
        if (target !== grid.selectors.activeItem && target.matches(enabledItemSelector) && container.contains(target)) {
            grid.goTo(() => target);
        }

        move();
        return true;
    }

    container.addEventListener(
        'keydown',
        (evt: KeyboardEvent) => {
            const handled = gridNav ? handleGridKey(gridNav, gridRowSelector, evt) : handleListKey(evt);
            if (handled) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        },
        { signal },
    );

    // ─── tabindex management ───────────────────────────────────────

    if (isTabStopRendered) return nav;

    // Track focus inside container
    const containerFocus = trackContainerFocus(container, signal);

    /** Current tab stop in the DOM (`tabindex="0"` item). */
    const getTabStop = () => container.querySelector<HTMLElement>(itemActiveSelector);

    /** Find the enabled item nearest to `anchor` (the anchor itself, then forward, then backward). */
    function findNearestEnabled(anchor: Node): HTMLElement | null {
        if (!container.contains(anchor)) return container.querySelector<HTMLElement>(enabledItemSelector);

        // If the anchor itself is an enabled item, return it directly.
        if (anchor instanceof HTMLElement && anchor.matches(enabledItemSelector)) return anchor;

        // Walk forward from the anchor for the nearest enabled item, then backward.
        const walker = createSelectorTreeWalker(container, enabledItemSelector);
        walker.currentNode = anchor;
        const next = walker.nextNode();
        if (next instanceof HTMLElement) return next;
        walker.currentNode = anchor;
        return walker.previousNode() as HTMLElement | null;
    }

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
            const fallback = container.querySelector<HTMLElement>(enabledItemSelector);
            if (fallback) setTabIndex(fallback, '0');
        }
    }

    /** Enforce the single-tabstop invariant across all items. */
    function normalizeAllItems(): void {
        const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
        const activeItem = getTabStop();

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
            (anchor && findNearestEnabled(anchor)) ?? container.querySelector<HTMLElement>(enabledItemSelector);
        if (!fallback) return;
        if (shouldFocus) {
            nav.goTo(() => fallback);
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
            const tabStops = Array.from(container.querySelectorAll<HTMLElement>(itemActiveSelector));
            const hasTabStop = tabStops.some((item) => !insertedItems.includes(item));
            // Without a tab stop among the existing items, an inserted item rendered as the tab stop keeps it
            // (e.g. a framework re-render that replaces the items).
            const renderedTabStop = hasTabStop
                ? undefined
                : tabStops.find((item) => !itemDisabledSelector || !item.matches(itemDisabledSelector));
            normalizeItems(
                renderedTabStop
                    ? [renderedTabStop, ...insertedItems.filter((item) => item !== renderedTabStop)]
                    : insertedItems,
                hasTabStop,
            );
        }

        // Handle disabled
        if (disabledTargets.length > 0) {
            const currentActive = getTabStop();
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

    return nav;
}
