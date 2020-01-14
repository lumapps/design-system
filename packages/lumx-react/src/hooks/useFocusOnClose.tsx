import { useEffect } from 'react';

/**
 * Re-focus the element when the select is closed.
 *
 * @param element             Element to focus.
 * @param isOpen              Whether or not the select is open.
 * @param shouldFocusOnClose  Whether or not the select is open.
 */
function useFocusOnClose(element: HTMLElement | null, isOpen: boolean, shouldFocusOnClose: boolean = true): void {
    useEffect(() => {
        /**
         * `shouldFocusOnClose` is passed on and evaluated here in order to avoid
         * breaking the rules of hooks: https://reactjs.org/docs/hooks-rules.html
         */
        if (shouldFocusOnClose && !isOpen && element) {
            // Re-focus the button when the select is closed.
            element.focus();
        }
    }, [isOpen, shouldFocusOnClose]);
}

export { useFocusOnClose };
