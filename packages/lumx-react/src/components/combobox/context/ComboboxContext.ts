import { createContext, Dispatch, RefObject, SetStateAction, useContext } from 'react';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';

/** Context value shared between Combobox sub-components. */
export interface ComboboxContextValue {
    /** The current ComboboxHandle (set by the trigger sub-component). */
    handle: ComboboxHandle | null;
    /** Setter for the handle (called by trigger on mount/unmount). */
    setHandle: Dispatch<SetStateAction<ComboboxHandle | null>>;
    /** The ID of the listbox element. */
    listboxId: string;
    /** Reference to the anchor element for popover positioning. */
    anchorRef: RefObject<HTMLElement | null>;
}

export const ComboboxContext = createContext<ComboboxContextValue | undefined>(undefined);

/**
 * Hook to access the Combobox context.
 * @throws Error if used outside of a Combobox component.
 * @returns The combobox context value.
 */
export function useComboboxContext() {
    const context = useContext(ComboboxContext);
    if (!context) {
        throw new Error('Combobox sub-components must be used within a Combobox');
    }
    return context;
}
