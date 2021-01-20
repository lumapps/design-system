import { useEffect } from 'react';

import { DOCUMENT } from '@lumx/react/constants';

/**
 * Get first and last elements focusable in an element.
 *
 * @param parentElement The element in which to search focusable elements.
 * @return first and last focusable elements
 */
function getFocusable(parentElement: HTMLElement) {
    const focusableElements = parentElement.querySelectorAll<HTMLElement>(
        'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), textarea:not([tabindex="-1"]), input[type="text"]:not([tabindex="-1"]), input[type="radio"]:not([tabindex="-1"]), input[type="checkbox"]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length <= 0) {
        return {};
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    return { first, last };
}

/**
 * Add a key down event handler to the given root element (document.body by default) to trap the move of focus
 * (TAB and SHIFT-TAB keys) inside the given focusZoneElement.
 * Will focus the given focus element when activating the focus trap.
 *
 * @param focusZoneElement The element in which to trap the focus.
 * @param focusElement     The element to focus when the focus trap is activated.
 * @param rootElement      The element on which the key down event will be placed.
 */
export function useFocusTrap(
    focusZoneElement: HTMLElement | null,
    focusElement?: HTMLElement | null,
    rootElement = DOCUMENT?.body,
): void {
    useEffect(() => {
        if (rootElement && focusZoneElement) {
            (document.activeElement as HTMLElement)?.blur();
            if (focusElement) {
                focusElement.focus();
            }

            const onKeyDown = (evt: KeyboardEvent) => {
                const { key } = evt;
                if (key !== 'Tab') {
                    return;
                }
                const { first, last } = getFocusable(focusZoneElement);

                // Prevent focus switch if no focusable available.
                if (!first) {
                    evt.preventDefault();
                    return;
                }

                if (evt.shiftKey) {
                    if (document.activeElement === first) {
                        last?.focus();
                        evt.preventDefault();
                    }
                } else if (document.activeElement === last) {
                    first?.focus();
                    evt.preventDefault();
                }
            };
            rootElement.addEventListener('keydown', onKeyDown);
            return () => rootElement.removeEventListener('keydown', onKeyDown);
        }
        return undefined;
    }, [focusElement, focusZoneElement, rootElement]);
}
