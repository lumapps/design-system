import type { FocusNavigationCallbacks } from './types';

/**
 * Internal state for tracking the active (focused) item.
 * Shared by both list and grid navigation implementations.
 */
export interface ActiveItemState {
    /** Get the currently active item. */
    readonly active: HTMLElement | null;
    /** Set the active item (handles deactivate/activate callbacks). */
    setActive(item: HTMLElement | null): void;
    /** Clear the active item (deactivate + clear callbacks). */
    clear(): void;
}

/**
 * Create shared active item state with cleanup on abort.
 *
 * Callback invocation:
 * - `setActive(item)`: calls `onDeactivate(previous)` then `onActivate(item)`.
 * - `clear()`: calls `onDeactivate(current)` then `onClear()`.
 * - On `signal.abort()`: same as `clear()`.
 *
 * @param callbacks Focus state change callbacks.
 * @param signal AbortSignal for cleanup.
 * @param initialItem Optional item to silently pre-select on creation (no callbacks fired).
 */
export function createActiveItemState(
    callbacks: FocusNavigationCallbacks,
    signal: AbortSignal,
    initialItem?: HTMLElement | null,
): ActiveItemState {
    let activeItem: HTMLElement | null = initialItem ?? null;
    function clear() {
        if (activeItem) {
            callbacks.onDeactivate(activeItem);
            activeItem = null;
        }
        callbacks.onClear?.();
    }
    signal.addEventListener('abort', clear);

    return {
        get active() {
            return activeItem;
        },
        setActive(item: HTMLElement | null): void {
            if (activeItem === item) return;
            if (activeItem) {
                callbacks.onDeactivate(activeItem);
            }
            activeItem = item;
            if (item) {
                callbacks.onActivate(item);
            }
        },
        clear,
    };
}
