import { useEffect } from 'react';

/**
 * Re-focus the element when the select is closed.
 *
 * @param element Element to focus.
 * @param isOpen  Whether or not the select is open.
 */
function useFocusOnClose(element: HTMLElement | null, isOpen: boolean | undefined): void {
    useEffect(() => {
        if (!isOpen && element) {
            // Re-focus the button when the select is closed.
            element.focus();
        }
    }, [isOpen]);
}

export { useFocusOnClose };
