import { useEffect } from 'react';

import { TAB_KEY_CODE } from '@lumx/core/js/constants';

/**
 * Add a key down event handler to the given root element (document.body by default) to trap the move of focus
 * (TAB and SHIFT-TAB keys) inside the given focusZoneElement.
 *
 * @param focusZoneElement The element in which to trap the focus.
 * @param rootElement      The element on which the key down event will be placed.
 */
export const useFocusTrap = (focusZoneElement: HTMLElement | null, rootElement = document.body) => {
    useEffect(() => {
        if (focusZoneElement) {
            const onKeyDown = (evt: KeyboardEvent) => {
                if (evt.keyCode !== TAB_KEY_CODE) {
                    return;
                }

                const focusableElements = focusZoneElement.querySelectorAll<HTMLElement>(
                    'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), textarea:not([tabindex="-1"]), input[type="text"]:not([tabindex="-1"]), input[type="radio"]:not([tabindex="-1"]), input[type="checkbox"]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
                );

                const firstFocusableElement = focusableElements[0];
                const lastFocusableElement = focusableElements[focusableElements.length - 1];

                if (evt.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        evt.preventDefault();
                    }
                } else if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    evt.preventDefault();
                }
            };
            rootElement.addEventListener('keydown', onKeyDown);
            return () => rootElement.removeEventListener('keydown', onKeyDown);
        }
        return;
    }, [focusZoneElement, rootElement]);
};
