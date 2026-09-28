import { getFirstAndLastFocusable } from './getFirstAndLastFocusable';

export interface SetupInitialFocusOptions {
    /** The element in which to move the focus. */
    focusZoneElement: HTMLElement;
    /**
     * The element to focus.
     * Falls back to the first focusable element inside the zone, then to the zone element itself.
     */
    focusElement?: HTMLElement | null;
}

/**
 * Focus the zone element itself (last-resort fallback, e.g. an empty dialog).
 *
 * Adds a `tabindex="-1"` if needed to make the zone programmatically focusable, removed when the signal aborts.
 *
 * @param focusZoneElement The zone element.
 * @param signal           AbortSignal used to remove the added `tabindex`.
 */
export function focusZoneFallback(focusZoneElement: HTMLElement, signal: AbortSignal): void {
    if (!focusZoneElement.hasAttribute('tabindex')) {
        focusZoneElement.setAttribute('tabindex', '-1');
        signal.addEventListener('abort', () => focusZoneElement.removeAttribute('tabindex'), { once: true });
    }
    focusZoneElement.focus({ preventScroll: true });
}

/**
 * Move the focus into the `focusZoneElement`:
 * 1. Focus `focusElement` if provided and contained in the zone.
 * 2. Otherwise focus the first focusable descendant.
 * 3. Otherwise focus the zone element itself (falling back to setting `tabindex="-1"` if needed) so that
 *    keyboard users (especially screen reader users) land inside the zone (e.g. an empty dialog).
 *
 * @param options Initial focus configuration.
 * @param signal  AbortSignal used to tear down (removes the fallback `tabindex` if it was added).
 */
export function setupInitialFocus(options: SetupInitialFocusOptions, signal: AbortSignal): void {
    const { focusZoneElement, focusElement } = options;

    if (!focusZoneElement || signal.aborted) {
        return;
    }

    if (focusElement && focusZoneElement.contains(focusElement)) {
        // Focus the given element.
        focusElement.focus({ preventScroll: true });
        return;
    }

    const firstFocusable = getFirstAndLastFocusable(focusZoneElement).first;
    if (firstFocusable) {
        // Focus the first focusable descendant.
        firstFocusable.focus({ preventScroll: true });
        return;
    }

    // No focusable descendant — fall back to the zone itself.
    focusZoneFallback(focusZoneElement, signal);
}
