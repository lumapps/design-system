import { useEffect } from 'react';

import { setupFocusTrap } from '@lumx/core/js/utils/focus/setupFocusTrap';
import { Falsy } from '@lumx/react/utils/type';

/**
 * Trap 'Tab' focus switch inside the `focusZoneElement`.
 *
 * If multiple focus traps are activated, only the last one is maintained and when a focus trap closes, the previous one
 * gets activated again.
 *
 * If the zone has no focusable descendant, the zone element itself receives focus (with a fallback `tabindex="-1"`).
 *
 * @param focusZoneElement The element in which to trap the focus.
 * @param focusElement     The element to focus when the focus trap is activated (otherwise the first focusable element
 *                         will be focused — and finally the zone element itself if no focusable is found).
 */
export function useFocusTrap(focusZoneElement: HTMLElement | Falsy, focusElement?: HTMLElement | null): void {
    useEffect(() => {
        if (!focusZoneElement) {
            return undefined;
        }

        const controller = new AbortController();
        setupFocusTrap({ focusZoneElement, focusElement }, controller.signal);
        return () => controller.abort();
    }, [focusElement, focusZoneElement]);
}
