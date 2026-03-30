import type { ComboboxHandle } from './types';

/**
 * Delay before inserting content into the aria-live region after the popover opens (ms).
 *
 * The popover uses `closeMode="hide"` (`display:none` when closed), so the live region
 * container is not in the accessibility tree until the popover becomes visible.
 * Screen readers only detect content *changes* in live regions that are already visible.
 * This delay ensures the popover's `display:none` is removed and the accessibility tree
 * is updated before content is inserted, so screen readers reliably announce it.
 */
const OPEN_ANNOUNCEMENT_DELAY = 100;

/** Setters invoked by `subscribeComboboxState` when handle events fire. */
export interface ComboboxStateSetters {
    /** Called immediately with the current loading state, then on every `loadingChange` event. */
    setIsLoading: (value: boolean) => void;
    /** Called on every `loadingAnnouncement` event (debounced 500ms after skeletons mount). */
    setShouldAnnounce: (value: boolean) => void;
    /** Called with `true` after a short delay when the combobox opens, and `false` immediately on close. */
    setIsOpen: (value: boolean) => void;
}

/**
 * Subscribe to the combobox handle events needed by `ComboboxState`.
 *
 * Manages three subscriptions:
 * - `loadingChange` → `setIsLoading` (+ synchronous initial read of `handle.isLoading`)
 * - `loadingAnnouncement` → `setShouldAnnounce`
 * - `open` → `setIsOpen` (deferred by {@link OPEN_ANNOUNCEMENT_DELAY}ms on open, immediate on close)
 *
 * @param handle  The combobox handle to subscribe to.
 * @param setters Framework-specific state setters.
 * @returns A cleanup function that unsubscribes all events and clears timers.
 */
export function subscribeComboboxState(handle: ComboboxHandle, setters: ComboboxStateSetters): () => void {
    const { setIsLoading, setShouldAnnounce, setIsOpen } = setters;

    // Read current loading state synchronously
    setIsLoading(handle.isLoading);

    const unsubLoadingChange = handle.subscribe('loadingChange', setIsLoading);
    const unsubLoadingAnnouncement = handle.subscribe('loadingAnnouncement', setShouldAnnounce);

    let openTimer: ReturnType<typeof setTimeout> | undefined;
    const unsubOpen = handle.subscribe('open', (open) => {
        clearTimeout(openTimer);
        if (open) {
            // Delay content insertion so the popover is visible in the
            // accessibility tree before the live region content changes.
            openTimer = setTimeout(() => setIsOpen(true), OPEN_ANNOUNCEMENT_DELAY);
        } else {
            // Reset immediately on close
            setIsOpen(false);
        }
    });

    return () => {
        unsubLoadingChange();
        unsubLoadingAnnouncement();
        unsubOpen();
        clearTimeout(openTimer);
    };
}
