import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';
import type { ListFocusNavigationSelectors, ListNavigationOptions } from './types';

/**
 * Create the pure selection layer for a 1D list.
 *
 * Everything here is side-effect-free: it only *queries* the DOM to resolve and report
 * items. No focus is moved and no {@link FocusNavigationCallbacks} are invoked — that is
 * the job of the mover layer built on top of this (`createListFocusNavigation`).
 *
 * @param options List navigation options (container, itemSelector, itemDisabledSelector, getActiveItem).
 * @returns The public {@link ListFocusNavigationSelectors} plus the internal
 *   {@link ListSelectorHelpers} the mover layer consumes.
 */
export function createListSelectors(options: ListNavigationOptions) {
    const { container, itemSelector, itemDisabledSelector, getActiveItem = () => null } = options;

    /** Combined CSS selector matching enabled (non-disabled) items. */
    const enabledItemSelector = itemDisabledSelector ? `${itemSelector}:not(${itemDisabledSelector})` : itemSelector;

    function createItemWalker(enabledOnly = true): TreeWalker {
        const selector = enabledOnly ? enabledItemSelector : itemSelector;
        return createSelectorTreeWalker(container, selector);
    }

    function findFirstEnabled(): HTMLElement | null {
        return container.querySelector<HTMLElement>(enabledItemSelector);
    }

    function findLastEnabled(): HTMLElement | null {
        const items = container.querySelectorAll<HTMLElement>(enabledItemSelector);
        return items.length > 0 ? items[items.length - 1] : null;
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

    function findNearestEnabled(anchor: Node): HTMLElement | null {
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
    }

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
        findNearestEnabled,
    };

    const helpers = {
        createItemWalker,
        findFirstEnabled,
        findLastEnabled,
        getActiveItem,
    };

    return { selectors, helpers };
}
