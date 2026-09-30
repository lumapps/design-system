import { createContext, useContext } from 'react';

/** Context value provided by Combobox.Option to its `after` slot children. */
export interface ListboxOptionContextValue {
    /** The ID of the parent option element (matches the aria-activedescendant value when highlighted). */
    optionId: string;
    /** Whether the parent option is selected. */
    isSelected: boolean;
}

export const ListboxOptionContext = createContext<ListboxOptionContextValue | undefined>(undefined);

/**
 * Hook to access the Combobox.Option context.
 * Must be used within a Combobox.Option's `after` slot.
 * @throws Error if used outside of a Combobox.Option.
 * @returns The option context value.
 */
export function useListboxOptionContext() {
    const context = useContext(ListboxOptionContext);
    if (!context) {
        throw new Error('Combobox.OptionMoreInfo must be used within a Combobox.Option `after` slot');
    }
    return context;
}
