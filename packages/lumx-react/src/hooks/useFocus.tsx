import { useEffect } from 'react';

/**
 * Hook focusing an element when defined and `focus` boolean `true`.
 *
 * @param element       Element to focus.
 * @param shouldFocus   Boolean flag to trigger the focus
 */
export function useFocus(element: HTMLElement | null | undefined, shouldFocus = true) {
    useEffect(() => {
        if (shouldFocus && element) {
            element.focus();
        }
    }, [element, shouldFocus]);
}
