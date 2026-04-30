import { DOCUMENT } from '../../constants/browser';
import { makeListenerTowerContext, type Listener } from '../function/listenerTower';
import { getFirstAndLastFocusable } from './getFirstAndLastFocusable';

/**
 * Shared listener tower for focus traps.
 *
 * When multiple traps are activated, only the last registered one is active. When it tears down, the previously
 * registered trap is re-enabled.
 */
const FOCUS_TRAPS = makeListenerTowerContext();

export interface SetupFocusTrapOptions {
    /** The element in which to trap the focus. */
    focusZoneElement: HTMLElement;
    /**
     * The element to focus when the trap is activated.
     * Falls back to the first focusable element inside the zone, then to the zone element itself.
     */
    focusElement?: HTMLElement | null;
}

/**
 * Trap 'Tab' focus switch inside the `focusZoneElement`.
 *
 * Setup behavior:
 * 1. Focus `focusElement` if provided and contained in the zone.
 * 2. Otherwise focus the first focusable descendant.
 * 3. Otherwise focus the zone element itself (falling back to setting `tabindex="-1"` if needed) so that
 *    keyboard users (especially screen reader users) land inside the trapped region (e.g. an empty dialog).
 *
 * Tab key behavior:
 * - With at least one focusable descendant: focus cycles between the first and last focusable in the zone.
 * - With no focusable descendant: Tab is swallowed and focus is restored to the zone element itself.
 *
 * Multiple traps stack — only the latest one is active; previous traps re-enable when the latest is torn down.
 *
 * @param options Trap configuration.
 * @param signal  AbortSignal used to tear down the trap.
 */
export function setupFocusTrap(options: SetupFocusTrapOptions, signal: AbortSignal): void {
    const { focusZoneElement, focusElement } = options;

    // Body element can be undefined in SSR context.
    const rootElement = DOCUMENT?.body;
    if (!rootElement || !focusZoneElement || signal.aborted) {
        return;
    }

    // Use the shadow root as focus zone when available.
    const focusZoneElementOrShadowRoot: HTMLElement | ShadowRoot = focusZoneElement.shadowRoot || focusZoneElement;

    // Track whether we added a `tabindex="-1"` so we can restore the original state on teardown.
    let addedTabIndex = false;

    /** Make the zone element programmatically focusable (so we can fall back to it). */
    const ensureZoneIsFocusable = () => {
        if (!focusZoneElement.hasAttribute('tabindex')) {
            focusZoneElement.setAttribute('tabindex', '-1');
            addedTabIndex = true;
        }
    };

    /** Focus the zone element itself as a last-resort fallback. */
    const focusZoneFallback = () => {
        ensureZoneIsFocusable();
        focusZoneElement.focus({ preventScroll: true });
    };

    // Trap 'Tab' key down focus switch into the focus zone.
    const trapTabFocusInFocusZone = (evt: KeyboardEvent) => {
        if (evt.key !== 'Tab') {
            return;
        }

        const focusable = getFirstAndLastFocusable(focusZoneElementOrShadowRoot);

        // Prevent focus switch if no focusable available — pin focus on the zone itself.
        if (!focusable.first) {
            evt.preventDefault();
            focusZoneFallback();
            return;
        }

        const activeElement = focusZoneElement.shadowRoot
            ? focusZoneElement.shadowRoot.activeElement
            : DOCUMENT?.activeElement;

        if (
            // No previous focus.
            !activeElement ||
            // Previous focus is at the end of the focus zone.
            (!evt.shiftKey && activeElement === focusable.last) ||
            // Previous focus is outside the focus zone.
            !focusZoneElementOrShadowRoot.contains(activeElement)
        ) {
            focusable.first.focus();
            evt.preventDefault();
            return;
        }

        if (
            // Focus order reversed.
            evt.shiftKey &&
            // Previous focus is at the start of the focus zone.
            activeElement === focusable.first
        ) {
            focusable.last.focus();
            evt.preventDefault();
        }
    };

    const focusTrap: Listener = {
        enable: () => rootElement.addEventListener('keydown', trapTabFocusInFocusZone),
        disable: () => rootElement.removeEventListener('keydown', trapTabFocusInFocusZone),
    };

    // SETUP: focus initial element.
    if (focusElement && focusZoneElementOrShadowRoot.contains(focusElement)) {
        // Focus the given element.
        focusElement.focus({ preventScroll: true });
    } else {
        const firstFocusable = getFirstAndLastFocusable(focusZoneElementOrShadowRoot).first;
        if (firstFocusable) {
            // Focus the first focusable descendant.
            firstFocusable.focus({ preventScroll: true });
        } else {
            // No focusable descendant — fall back to the zone itself (e.g. an empty dialog).
            focusZoneFallback();
        }
    }

    FOCUS_TRAPS.register(focusTrap);

    // TEARDOWN.
    signal.addEventListener(
        'abort',
        () => {
            FOCUS_TRAPS.unregister(focusTrap);
            if (addedTabIndex) {
                focusZoneElement.removeAttribute('tabindex');
            }
        },
        { once: true },
    );
}
