import { createContext, useContext } from 'react';

/** Context value for the Combobox.List sub-tree. */
export interface ComboboxListContextValue {
    /** The popup type. "grid" enables 2D keyboard navigation and action buttons on options. */
    type: 'listbox' | 'grid';
}

export const ComboboxListContext = createContext<ComboboxListContextValue>({ type: 'listbox' });

/**
 * Hook to access the Combobox.List context (provides the `type`).
 * @returns The list context value.
 */
export function useComboboxListContext() {
    return useContext(ComboboxListContext);
}
