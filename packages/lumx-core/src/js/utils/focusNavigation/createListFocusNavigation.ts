import { createActiveItemState } from './createActiveItemState';
import type { FocusNavigationCallbacks, FocusNavigationController, ListNavigationOptions } from './types';

/**
 * Create a focus navigation controller for a 1D list.
 *
 * @param options List navigation options (container, itemSelector, direction, wrap).
 * @param callbacks Callbacks for focus state changes.
 * @param signal AbortSignal for cleanup.
 * @returns FocusNavigationController instance.
 */
export function createListFocusNavigation(
    options: ListNavigationOptions,
    callbacks: FocusNavigationCallbacks,
    signal: AbortSignal,
): FocusNavigationController {
    const {
        container,
        itemSelector,
        direction = 'vertical',
        wrap = false,
        itemDisabledSelector,
        itemActiveSelector,
    } = options;
    const initialItem = itemActiveSelector ? container.querySelector<HTMLElement>(itemActiveSelector) ?? null : null;
    const state = createActiveItemState(callbacks, signal, initialItem);

    /** Combined CSS selector matching enabled (non-disabled) items. */
    const enabledItemSelector = itemDisabledSelector ? `${itemSelector}:not(${itemDisabledSelector})` : itemSelector;

    /**
     * Create a TreeWalker over items in the container.
     * @param enabledOnly When true (default), disabled items are skipped.
     */
    function createItemWalker(enabledOnly = true): TreeWalker {
        const selector = enabledOnly ? enabledItemSelector : itemSelector;
        return document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
            acceptNode(node: Node) {
                return (node as HTMLElement).matches(selector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            },
        });
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

    /** Navigate to the first enabled item and set it as active. */
    function goToFirst(): boolean {
        const first = findFirstEnabled();
        if (!first) return false;
        state.setActive(first);
        return true;
    }

    /** Navigate to the last enabled item and set it as active. */
    function goToLast(): boolean {
        const last = findLastEnabled();
        if (!last) return false;
        state.setActive(last);
        return true;
    }

    function navigateByOffset(offset: number): boolean {
        if (offset === 0) return state.active !== null;

        const forward = offset > 0;
        const stepsNeeded = Math.abs(offset);

        // No active item — try to recover from DOM state, then fall back to first/last.
        if (!state.active) {
            const activeFromDom = itemActiveSelector && container.querySelector<HTMLElement>(itemActiveSelector);
            if (activeFromDom && activeFromDom.matches(enabledItemSelector)) {
                state.setActive(activeFromDom);
            } else {
                const started = forward ? goToFirst() : goToLast();
                if (!started) return false;
            }
            if (stepsNeeded === 1) return true;
            return navigateByOffset(forward ? offset - 1 : offset + 1);
        }

        // Walk from the active item using a TreeWalker.
        const walker = createItemWalker();
        walker.currentNode = state.active;

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
                if (!wrapped || wrapped === state.active) break;
                lastFound = wrapped;
                stepsCompleted += 1;
                walker.currentNode = wrapped;
            } else {
                break;
            }
        }

        if (stepsCompleted === 0) return false;
        state.setActive(lastFound!);
        return true;
    }

    const navigateForward = () => navigateByOffset(1);
    const navigateBackward = () => navigateByOffset(-1);

    return {
        type: 'list',

        get activeItem() {
            return state.active;
        },
        get hasActiveItem() {
            return state.active !== null;
        },
        get hasNavigableItems() {
            return container.querySelector(enabledItemSelector) !== null;
        },

        goToFirst,
        goToLast,

        goToItem(item: HTMLElement): boolean {
            if (!item.matches(itemSelector)) return false;
            if (!container.contains(item)) return false;
            state.setActive(item);
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
                    state.setActive(node);
                    return true;
                }
                node = walker.nextNode() as HTMLElement | null;
            }
            return false;
        },

        clear: state.clear,

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
