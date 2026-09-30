import type { ListboxHandle } from '../Listbox/types';

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

/** Setters invoked by `subscribeListboxState` when handle events fire. */
export interface ListboxStateSetters {
    /** Called immediately with the current loading state, then on every `loadingChange` event. */
    setIsLoading: (value: boolean) => void;
    /** Called on every `loadingAnnouncement` event (debounced 500ms after skeletons mount). */
    setShouldAnnounce: (value: boolean) => void;
    /** Called with `true` after a short delay when the options become visible, and `false` immediately when hidden. */
    setIsOpen: (value: boolean) => void;
}

/**
 * Subscribe to the listbox handle events needed by `ListboxState`.
 *
 * Manages three subscriptions:
 * - `loadingChange` → `setIsLoading` (+ synchronous initial read of `list.isLoading`)
 * - `loadingAnnouncement` → `setShouldAnnounce`
 * - `open` → `setIsOpen` (deferred by {@link OPEN_ANNOUNCEMENT_DELAY}ms when shown, immediate when hidden)
 *   (a standalone listbox is always visible: `setIsOpen(true)` once, no subscription)
 *
 * @param list    The listbox handle to subscribe to (`ComboboxHandle.list` inside a combobox).
 * @param setters Framework-specific state setters.
 * @returns A cleanup function that unsubscribes all events and clears timers.
 */
export function subscribeListboxState(list: ListboxHandle, setters: ListboxStateSetters): () => void {
    const { setIsLoading, setShouldAnnounce, setIsOpen } = setters;

    // Read current loading state synchronously
    setIsLoading(list.isLoading);

    const unsubLoadingChange = list.subscribe('loadingChange', setIsLoading);
    const unsubLoadingAnnouncement = list.subscribe('loadingAnnouncement', setShouldAnnounce);

    // Standalone listbox: the options are always visible.
    if (list.isStandalone) {
        setIsOpen(true);
        return () => {
            unsubLoadingChange();
            unsubLoadingAnnouncement();
        };
    }

    let openTimer: ReturnType<typeof setTimeout> | undefined;
    const unsubVisible = list.subscribe('open', (visible) => {
        clearTimeout(openTimer);
        if (visible) {
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
        unsubVisible();
        clearTimeout(openTimer);
    };
}
