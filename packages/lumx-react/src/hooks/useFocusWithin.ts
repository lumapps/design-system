import { useEffect } from 'react';

export interface UseFocusWithinOptions {
    /** element to add the focus within to */
    element: HTMLElement | undefined;
    /** callback to be executed on focus in */
    onFocusIn: (ev: FocusEvent) => void;
    /** callback to be executed on focus out */
    onFocusOut: (ev: FocusEvent) => void;
}

/**
 * Hook that allows to control when there is a focus event within a given element, meaning
 * that any element within the given target will trigger the focus in and focus out events.
 * @param options - UseFocusWithinOptions
 */
export const useFocusWithin = ({ element, onFocusIn, onFocusOut }: UseFocusWithinOptions) => {
    useEffect(() => {
        if (element) {
            element.addEventListener('focusin', onFocusIn);

            element.addEventListener('focusout', onFocusOut);
        }

        return () => {
            if (element) {
                element.removeEventListener('focusin', onFocusIn);

                element.removeEventListener('focusout', onFocusOut);
            }
        };
    }, [onFocusIn, element, onFocusOut]);
};
