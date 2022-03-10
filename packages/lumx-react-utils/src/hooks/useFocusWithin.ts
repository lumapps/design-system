import { useEffect } from 'react';
import { Falsy } from '../utils/types';

export interface UseFocusWithinOptions {
    /**
     * Element on which to observe `focusin`/`focusout` event.
     * Set it to a "falsy" value to remove the listeners.
     */
    element: HTMLElement | Falsy;
    /** Callback to be executed on focus in */
    onFocusIn: (ev: FocusEvent) => void;
    /** Callback to be executed on focus out */
    onFocusOut: (ev: FocusEvent) => void;
}

/**
 * Hook that allows to control when there is a focus event within a given element, meaning
 * that any element within the given target will trigger the focus in and focus out events.
 * @param options - UseFocusWithinOptions
 */
export const useFocusWithin = ({ element, onFocusIn, onFocusOut }: UseFocusWithinOptions) => {
    useEffect(() => {
        if (!element) {
            return undefined;
        }

        element.addEventListener('focusin', onFocusIn);
        element.addEventListener('focusout', onFocusOut);
        return () => {
            element.removeEventListener('focusin', onFocusIn);
            element.removeEventListener('focusout', onFocusOut);
        };
    }, [onFocusIn, element, onFocusOut]);
};
