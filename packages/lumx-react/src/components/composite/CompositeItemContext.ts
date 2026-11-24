import { createContext, useContext } from 'react';

/**
 * Context value provided by an item of a composite widget (a `Combobox.Option` or a `TreeListItem`) to
 * everything it renders (its slots).
 */
export interface CompositeItemContextValue {
    /** The ID of the item element (matches the aria-activedescendant value when highlighted). */
    itemId: string;
    /** Whether the item is selected. */
    isSelected: boolean;
    /** Whether the item can be selected (false on a tree item without a value). Default: true. */
    isSelectable?: boolean;
}

export const CompositeItemContext = createContext<CompositeItemContextValue | undefined>(undefined);

/**
 * Access the composite item context.
 * Must be used within a `Combobox.Option` or a `TreeListItem` (e.g. in its `after` slot).
 * @throws Error if used outside of a `Combobox.Option` or a `TreeListItem`.
 * @returns The item context value.
 */
export function useCompositeItemContext() {
    const context = useContext(CompositeItemContext);
    if (!context) {
        throw new Error(
            'Composite item sub-components must be used within an item (a Combobox.Option or a TreeListItem)',
        );
    }
    return context;
}
