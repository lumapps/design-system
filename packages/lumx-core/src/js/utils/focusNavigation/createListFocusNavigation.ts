import { createPendingNavigation } from './createPendingNavigation';
import { createListSelectors } from './createListSelectors';
import type {
    FocusNavigationCallbacks,
    ListFocusNavigationController,
    ListFocusNavigationSelectors,
    ListNavigationOptions,
} from './types';

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
 * The controller is composed of two layers:
 * - a pure, side-effect-free **selection** layer ({@link createListSelectors}) that only
 *   resolves/reports items by querying the DOM, and
 * - a **mover** layer (this function) that commits focus by calling
 *   {@link FocusNavigationCallbacks} on top of the selectors.
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
    const { itemSelector, container, direction = 'vertical', wrap = false } = options;

    const { selectors, helpers } = createListSelectors(options);
    const { getActiveItem, createItemWalker, findFirstEnabled, findLastEnabled } = helpers;

    // Deferred navigation intent (replayed once items are committed to the DOM)
    const pending = createPendingNavigation(signal);

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

    /** Go to item at an offset */
    function goToOffset(offset: number): boolean {
        const active = getActiveItem();
        if (offset === 0) return active !== null;

        const forward = offset > 0;
        const stepsNeeded = Math.abs(offset);

        // No active item — fall back to first/last.
        if (!active) {
            const started = forward ? goToFirst() : goToLast();
            if (!started) return false;
            if (stepsNeeded === 1) return true;
            return goToOffset(forward ? offset - 1 : offset + 1);
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

    return {
        type: 'list',
        selectors,

        goToItem(item: HTMLElement): boolean {
            if (!item.matches(itemSelector)) return false;
            if (!container.contains(item)) return false;
            transition(getActiveItem, callbacks, item);
            return true;
        },

        goToOffset,

        clear,

        goTo(resolve: (selectors: ListFocusNavigationSelectors) => HTMLElement | null): boolean {
            const target = resolve(selectors);
            if (target && target.matches(itemSelector) && container.contains(target)) {
                transition(getActiveItem, callbacks, target);
                pending.clear();
                return true;
            }
            // Target not resolvable yet (e.g. items not committed to the DOM) — defer
            pending.defer(() => this.goTo(resolve));
            return false;
        },

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
