import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';
import type { FocusNavigationCallbacks, ListFocusNavigationController, ListNavigationOptions } from './types';

/**
 * Transition the active item: deactivate the current one (if any) and activate the new one.
 * Reads the current active item via `getActiveItem` so there is no internal state to desync.
 */
function transition(
    getActiveItem: () => HTMLElement | null,
    callbacks: FocusNavigationCallbacks,
    newItem: HTMLElement,
): void {
    const current = getActiveItem();
    if (current === newItem) return;
    if (current) callbacks.onDeactivate(current);
    callbacks.onActivate(newItem);
}

/**
 * Create a focus navigation controller for a 1D list.
 *
 * This controller is **stateless** — it does not maintain an internal reference to
 * the active item. Instead it reads the active item from the DOM each time via the
 * `getActiveItem` callback provided in the options. This avoids any desync between
 * the controller's internal state and the actual DOM.
 *
 * @param options List navigation options (container, itemSelector, direction, wrap, getActiveItem).
 * @param callbacks Callbacks for focus state changes.
 * @param signal AbortSignal for cleanup.
 * @returns ListFocusNavigationController instance.
 */
export function createListFocusNavigation(
    options: ListNavigationOptions,
    callbacks: FocusNavigationCallbacks,
    signal: AbortSignal,
): ListFocusNavigationController {
    const {
        container,
        itemSelector,
        direction = 'vertical',
        wrap = false,
        itemDisabledSelector,
        getActiveItem = () => null,
    } = options;

    /** Combined CSS selector matching enabled (non-disabled) items. */
    const enabledItemSelector = itemDisabledSelector ? `${itemSelector}:not(${itemDisabledSelector})` : itemSelector;

    /**
     * Create a TreeWalker over items in the container.
     * @param enabledOnly When true (default), disabled items are skipped.
     */
    function createItemWalker(enabledOnly = true): TreeWalker {
        const selector = enabledOnly ? enabledItemSelector : itemSelector;
        return createSelectorTreeWalker(container, selector);
    }

    /** Find the first enabled item in the container. */
    function findFirstEnabled(): HTMLElement | null {
        return container.querySelector<HTMLElement>(enabledItemSelector);
    }

    /** Find the last enabled item in the container. */
    function findLastEnabled(): HTMLElement | null {
        const items = container.querySelectorAll<HTMLElement>(enabledItemSelector);
        return items.length > 0 ? items[items.length - 1] : null;
    }

    /** Navigate to the first enabled item and activate it. */
    function goToFirst(): boolean {
        const first = findFirstEnabled();
        if (!first) return false;
        transition(getActiveItem, callbacks, first);
        return true;
    }

    /** Navigate to the last enabled item and activate it. */
    function goToLast(): boolean {
        const last = findLastEnabled();
        if (!last) return false;
        transition(getActiveItem, callbacks, last);
        return true;
    }

    function navigateByOffset(offset: number): boolean {
        const active = getActiveItem();
        if (offset === 0) return active !== null;

        const forward = offset > 0;
        const stepsNeeded = Math.abs(offset);

        // No active item — fall back to first/last.
        if (!active) {
            const started = forward ? goToFirst() : goToLast();
            if (!started) return false;
            if (stepsNeeded === 1) return true;
            return navigateByOffset(forward ? offset - 1 : offset + 1);
        }

        // Walk from the active item using a TreeWalker.
        const walker = createItemWalker();
        walker.currentNode = active;

        const step = forward ? () => walker.nextNode() : () => walker.previousNode();
        let stepsCompleted = 0;
        let lastFound: HTMLElement | null = null;

        for (let i = 0; i < stepsNeeded; i++) {
            const next = step() as HTMLElement | null;
            if (next) {
                lastFound = next;
                stepsCompleted += 1;
            } else if (wrap) {
                // Hit boundary — wrap around to the opposite end.
                const wrapped = forward ? findFirstEnabled() : findLastEnabled();
                if (!wrapped || wrapped === active) break;
                lastFound = wrapped;
                stepsCompleted += 1;
                walker.currentNode = wrapped;
            } else {
                break;
            }
        }

        if (stepsCompleted === 0) return false;
        transition(getActiveItem, callbacks, lastFound!);
        return true;
    }

    const navigateForward = () => navigateByOffset(1);
    const navigateBackward = () => navigateByOffset(-1);

    /** Clear the active item. */
    function clear(): void {
        const current = getActiveItem();
        if (current) {
            callbacks.onDeactivate(current);
        }
        callbacks.onClear?.();
    }

    // Cleanup on abort.
    signal.addEventListener('abort', clear);

    return {
        type: 'list',
        enabledItemSelector,

        get activeItem() {
            return getActiveItem();
        },
        get hasActiveItem() {
            return getActiveItem() !== null;
        },
        get hasNavigableItems() {
            return container.querySelector(enabledItemSelector) !== null;
        },

        goToFirst,
        goToLast,

        goToItem(item: HTMLElement): boolean {
            if (!item.matches(itemSelector)) return false;
            if (!container.contains(item)) return false;
            transition(getActiveItem, callbacks, item);
            return true;
        },

        goToOffset(offset: number): boolean {
            return navigateByOffset(offset);
        },

        goToItemMatching(predicate: (item: HTMLElement) => boolean): boolean {
            const walker = createItemWalker(false);
            let node = walker.nextNode() as HTMLElement | null;
            while (node) {
                if (predicate(node)) {
                    transition(getActiveItem, callbacks, node);
                    return true;
                }
                node = walker.nextNode() as HTMLElement | null;
            }
            return false;
        },

        findNearestEnabled(anchor: Node): HTMLElement | null {
            if (!container.contains(anchor)) return findFirstEnabled();

            // If the anchor itself is an enabled item, return it directly.
            if (anchor instanceof HTMLElement && anchor.matches(enabledItemSelector)) {
                return anchor;
            }

            // Walk forward from the anchor for the nearest enabled item.
            const walker = createItemWalker();
            walker.currentNode = anchor;
            const next = walker.nextNode();
            if (next instanceof HTMLElement) return next;

            // No enabled item after anchor — walk backward (reuse same walker).
            walker.currentNode = anchor;
            return walker.previousNode() as HTMLElement | null;
        },

        clear,

        goUp(): boolean {
            return direction === 'vertical' ? navigateBackward() : false;
        },

        goDown(): boolean {
            return direction === 'vertical' ? navigateForward() : false;
        },

        goLeft(): boolean {
            return direction === 'horizontal' ? navigateBackward() : false;
        },

        goRight(): boolean {
            return direction === 'horizontal' ? navigateForward() : false;
        },
    };
}
