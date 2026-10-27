import { createContext, useContext } from 'react';

/** Context value provided by an item of a composite widget (a `Combobox.Option`) to its `after` slot children. */
export interface CompositeItemContextValue {
    /** The ID of the item element (matches the aria-activedescendant value when highlighted). */
    itemId: string;
    /** Whether the item is selected. */
    isSelected: boolean;
}

export const CompositeItemContext = createContext<CompositeItemContextValue | undefined>(undefined);

/**
 * Access the composite item context.
 * Must be used within a `Combobox.Option` `after` slot.
 * @throws Error if used outside of a `Combobox.Option`.
 * @returns The item context value.
 */
export function useCompositeItemContext() {
    const context = useContext(CompositeItemContext);
    if (!context) {
        throw new Error('Combobox.Option sub-components must be used within a Combobox.Option `after` slot');
    }
    return context;
}
