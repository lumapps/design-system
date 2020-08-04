import { useEffect, useState } from 'react';

/**
 * Hook focusing an element when defined and `focus` boolean `true`.
 *
 * @param element       Element to focus.
 * @param shouldFocus   Boolean flag to trigger the focus
 */
export function useFocus(element: HTMLElement | null | undefined, shouldFocus = true) {
    const [wasFocus, setWasFocus] = useState(false);
    useEffect(() => {
        if (shouldFocus && wasFocus !== shouldFocus && element) {
            element.focus();
            setWasFocus(shouldFocus);
        }
    }, [element, shouldFocus]);
}
