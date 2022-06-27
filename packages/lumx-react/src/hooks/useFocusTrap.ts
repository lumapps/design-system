import { useEffect } from 'react';
import last from 'lodash/last';
import pull from 'lodash/pull';

import { DOCUMENT } from '@lumx/react/constants';
import { getFirstAndLastFocusable } from '@lumx/react/utils/focus/getFirstAndLastFocusable';
import { Falsy } from '@lumx/react/utils';

type Listener = { enable(): void; disable(): void };

/**
 * List of all focus traps.
 */
const FOCUS_TRAPS: Listener[] = [];

/**
 * Trap 'Tab' focus switch inside the `focusZoneElement`.
 *
 * If multiple focus trap are activated, only the last one is maintained and when a focus trap closes, the previous one
 * gets activated again.
 *
 * @param focusZoneElement The element in which to trap the focus.
 * @param focusElement     The element to focus when the focus trap is activated (otherwise the first focusable element
 *                         will be focused).
 */
export function useFocusTrap(focusZoneElement: HTMLElement | Falsy, focusElement?: HTMLElement | null): void {
    useEffect(() => {
        // Body element can be undefined in SSR context.
        const rootElement = DOCUMENT?.body;

        if (!rootElement || !focusZoneElement) {
            return undefined;
        }

        // Trap 'Tab' key down focus switch into the focus zone.
        const trapTabFocusInFocusZone = (evt: KeyboardEvent) => {
            const { key } = evt;
            if (key !== 'Tab') {
                return;
            }
            const focusable = getFirstAndLastFocusable(focusZoneElement);

            // Prevent focus switch if no focusable available.
            if (!focusable.first) {
                evt.preventDefault();
                return;
            }

            if (
                // No previous focus
                !document.activeElement ||
                // Previous focus is at the end of the focus zone.
                (!evt.shiftKey && document.activeElement === focusable.last) ||
                // Previous focus is outside the focus zone
                !focusZoneElement.contains(document.activeElement)
            ) {
                focusable.first.focus();
                evt.preventDefault();
                return;
            }

            if (
                // Focus order reversed
                evt.shiftKey &&
                // Previous focus is at the start of the focus zone.
                document.activeElement === focusable.first
            ) {
                focusable.last.focus();
                evt.preventDefault();
            }
        };

        const focusTrap: Listener = {
            enable: () => rootElement.addEventListener('keydown', trapTabFocusInFocusZone),
            disable: () => rootElement.removeEventListener('keydown', trapTabFocusInFocusZone),
        };

        // SETUP:

        if (focusElement && focusZoneElement.contains(focusElement)) {
            // Focus the given element.
            focusElement.focus();
        } else {
            // Focus the first focusable element in the zone.
            getFirstAndLastFocusable(focusZoneElement).first?.focus();
        }

        // Disable previous focus trap.
        last(FOCUS_TRAPS)?.disable();
        // Keep track of current focus trap.
        FOCUS_TRAPS.push(focusTrap);
        // Enable current focus trap.
        focusTrap.enable();

        // TEARDOWN:
        return () => {
            // Disable current focus trap.
            focusTrap.disable();
            // Remove current focus trap.
            pull(FOCUS_TRAPS, focusTrap);
            // Enable previous focus trap.
            last(FOCUS_TRAPS)?.enable();
        };
    }, [focusElement, focusZoneElement]);
}
