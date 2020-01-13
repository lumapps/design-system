import { useEffect } from 'react';

/**
 * Focus the element when the select is opene.
 *
 * @param element             Element to focus.
 * @param isOpen              Whether or not the select is open.
 * @param shouldFocusOnOpen   Whether or not the focus should be set.
 */
function useFocusOnOpen(
    element: HTMLElement | null,
    isOpen: boolean | undefined,
    shouldFocusOnOpen: boolean | undefined,
): void {
    useEffect(() => {
        if (isOpen && element && shouldFocusOnOpen) {
            // Focus the element when the select is open.
            element.focus();
        }
    }, [isOpen, element, shouldFocusOnOpen]);
}

export { useFocusOnOpen };
