import { createPendingNavigation } from './createPendingNavigation';
import type {
    FocusNavigationCallbacks,
    ListFocusNavigationController,
    ListFocusNavigationSelectors,
    ListNavigationOptions,
} from './types';
import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';

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

    /** Create a TreeWalker over items in the container. */
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

    // Deferred navigation intent (replayed once items are committed to the DOM)
    const pending = createPendingNavigation(signal);

    /** Find item at offset (lazily walk nodes) */
    function findAtOffset(offset: number): HTMLElement | null {
        const forward = offset > 0;
        const stepsNeeded = Math.abs(offset);
        const active = getActiveItem();

        const walker = createItemWalker();
        const step = forward ? () => walker.nextNode() : () => walker.previousNode();

        let target: HTMLElement | null = null;
        let remaining = stepsNeeded;

        if (active) {
            // Walk from the active item.
            walker.currentNode = active;
        } else if (!forward) {
            // Walking backward with no active item: position at the last enabled item
            target = walker.lastChild() as HTMLElement | null;
            if (!target) return null;
            remaining -= 1;
        }

        for (let i = 0; i < remaining; i++) {
            const next = step() as HTMLElement | null;
            if (next) {
                target = next;
            } else if (active && wrap) {
                // Hit boundary with an active item — wrap around to the opposite end.
                const wrapped = forward ? findFirstEnabled() : findLastEnabled();
                if (!wrapped || wrapped === active) break;
                target = wrapped;
                walker.currentNode = wrapped;
            } else {
                break;
            }
        }
        return target;
    }

    function findMatching(predicate: (item: HTMLElement) => boolean): HTMLElement | null {
        const walker = createItemWalker(false);
        let node = walker.nextNode() as HTMLElement | null;
        while (node) {
            if (predicate(node)) return node;
            node = walker.nextNode() as HTMLElement | null;
        }
        return null;
    }

    /** Clear the active item and discard any pending navigation intent. */
    function clear(): void {
        const current = getActiveItem();
        if (current) {
            callbacks.onDeactivate(current);
        }
        pending.clear();
        callbacks.onClear?.();
    }

    // Cleanup on abort.
    signal.addEventListener('abort', clear);

    const selectors: ListFocusNavigationSelectors = {
        enabledItemSelector,

        get activeItem() {
            return getActiveItem();
        },
        get hasNavigableItems() {
            return container.querySelector(enabledItemSelector) !== null;
        },

        getFirst: findFirstEnabled,
        getLast: findLastEnabled,
        getMatching: findMatching,
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
    };

    /**
     * Navigate via a resolver. The resolver receives the selectors to find the target.
     * If the target is valid, focus is committed (deactivate current, activate target).
     * If the target is not resolvable yet, the intent is deferred for later replay.
     */
    function goTo(resolve: (selectors: ListFocusNavigationSelectors) => HTMLElement | null): boolean {
        const target = resolve(selectors);
        if (target && target.matches(itemSelector) && container.contains(target)) {
            const current = getActiveItem();
            if (current !== target) {
                if (current) callbacks.onDeactivate(current);
                callbacks.onActivate(target);
            }
            pending.clear();
            return true;
        }
        // Target not resolvable yet (e.g. items not committed to the DOM) — defer
        pending.defer(() => goTo(resolve));
        return false;
    }

    /** Go to the item at the given offset from the active item. */
    function goToOffset(offset: number): boolean {
        if (offset === 0) return getActiveItem() !== null;
        const target = findAtOffset(offset);
        if (!target) return false;
        return goTo(() => target);
    }

    return {
        type: 'list',
        selectors,

        goToOffset,

        clear,

        goTo,

        flushPendingNavigation(): void {
            pending.flush();
        },

        goUp(): boolean {
            return direction === 'vertical' ? goToOffset(-1) : false;
        },

        goDown(): boolean {
            return direction === 'vertical' ? goToOffset(1) : false;
        },

        goLeft(): boolean {
            return direction === 'horizontal' ? goToOffset(-1) : false;
        },

        goRight(): boolean {
            return direction === 'horizontal' ? goToOffset(1) : false;
        },
    };
}
