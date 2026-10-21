import { type InjectionKey, inject, provide } from 'vue';

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

const COMPOSITE_ITEM_CONTEXT_KEY: InjectionKey<CompositeItemContextValue> = Symbol('composite-item-context');

/**
 * Provide the composite item context (see `Combobox.Option` and `TreeListItem`).
 */
export function provideCompositeItemContext(value: CompositeItemContextValue) {
    provide(COMPOSITE_ITEM_CONTEXT_KEY, value);
}

/**
 * Access the composite item context.
 * Must be used within a `Combobox.Option` or a `TreeListItem` (e.g. in its `after` slot).
 * @throws Error if used outside of a `Combobox.Option` or a `TreeListItem`.
 * @returns The item context value.
 */
export function useCompositeItemContext(): CompositeItemContextValue {
    const context = inject(COMPOSITE_ITEM_CONTEXT_KEY);
    if (!context) {
        throw new Error(
            'Composite item sub-components must be used within an item (a Combobox.Option or a TreeListItem)',
        );
    }
    return context;
}
