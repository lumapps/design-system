import { createContext, Dispatch, RefObject, SetStateAction, useContext } from 'react';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';
import type { CompositeHandle } from '@lumx/core/js/components/Composite/types';

/** Context value shared between Combobox sub-components. */
export interface ComboboxContextValue {
    /** The current ComboboxHandle (set by the trigger sub-component). */
    handle: ComboboxHandle | null;
    /** Setter for the handle (called by trigger on mount/unmount). */
    setHandle: Dispatch<SetStateAction<ComboboxHandle | null>>;
    /** The list registered on the combobox handle (null until the list component registers it). */
    list: CompositeHandle | null;
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

/** Access the Combobox context, or `undefined` outside of a Combobox (does not throw). */
export function useOptionalComboboxContext(): ComboboxContextValue | undefined {
    return useContext(ComboboxContext);
}
