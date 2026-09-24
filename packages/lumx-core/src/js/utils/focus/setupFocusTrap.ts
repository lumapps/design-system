import { makeListenerTowerContext, type Listener } from '../function/listenerTower';
import { getFirstAndLastFocusable } from './getFirstAndLastFocusable';
import { focusZoneFallback, setupInitialFocus, type SetupInitialFocusOptions } from './setupInitialFocus';

/**
 * Shared listener tower for focus traps.
 *
 * When multiple traps are activated, only the last registered one is active. When it tears down, the previously
 * registered trap is re-enabled.
 */
const FOCUS_TRAPS = makeListenerTowerContext();

/** Focus trap options: the zone in which to trap the focus, and the element to focus on activation. */
export type SetupFocusTrapOptions = SetupInitialFocusOptions;

/**
 * Trap 'Tab' focus switch inside the `focusZoneElement`.
 *
 * Setup behavior: move the focus into the zone (see `setupInitialFocus`).
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
    const { focusZoneElement } = options;

    if (!focusZoneElement || signal.aborted) {
        return;
    }

    // The root node is either the Document (regular DOM) or a ShadowRoot (shadow DOM portal).
    const rootNode = focusZoneElement.getRootNode() as Document | ShadowRoot;

    // Trap 'Tab' key down focus switch into the focus zone.
    const trapTabFocusInFocusZone = (evt: KeyboardEvent) => {
        if (evt.key !== 'Tab') {
            return;
        }

        const focusable = getFirstAndLastFocusable(focusZoneElement);

        // Prevent focus switch if no focusable available — pin focus on the zone itself.
        if (!focusable.first) {
            evt.preventDefault();
            focusZoneFallback(focusZoneElement, signal);
            return;
        }

        const { activeElement } = rootNode;

        if (
            // No previous focus.
            !activeElement ||
            // Previous focus is at the end of the focus zone.
            (!evt.shiftKey && activeElement === focusable.last) ||
            // Previous focus is outside the focus zone.
            !focusZoneElement.contains(activeElement)
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

    const keydownHandler = trapTabFocusInFocusZone as EventListener;
    const focusTrap: Listener = {
        enable: () => rootNode.addEventListener('keydown', keydownHandler),
        disable: () => rootNode.removeEventListener('keydown', keydownHandler),
    };

    // SETUP: focus initial element.
    setupInitialFocus(options, signal);

    FOCUS_TRAPS.register(focusTrap);

    // TEARDOWN.
    signal.addEventListener('abort', () => FOCUS_TRAPS.unregister(focusTrap), { once: true });
}
