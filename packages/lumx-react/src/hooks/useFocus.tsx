import { useEffect, useState } from 'react';

/**
 * Hook focusing an element when defined and `focus` boolean `true`.
 *
 * @param element       Element to focus.
 * @param shouldFocus   Boolean flag to trigger the focus
 */
export function useFocus(element: HTMLElement | null | undefined, shouldFocus = true): void {
    const [wasFocus, setWasFocus] = useState(false);
    useEffect(
        () => {
            if (shouldFocus && wasFocus !== shouldFocus && element) {
                element.focus();
                setWasFocus(shouldFocus);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [element, shouldFocus],
    );
}
