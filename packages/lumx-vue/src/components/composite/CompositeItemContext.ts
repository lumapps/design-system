import { type InjectionKey, inject, provide } from 'vue';

/** Context value provided by an item of a composite widget (a `Combobox.Option`) to its `after` slot children. */
export interface CompositeItemContextValue {
    /** The ID of the item element (matches the aria-activedescendant value when highlighted). */
    itemId: string;
    /** Whether the item is selected. */
    isSelected: boolean;
}

const COMPOSITE_ITEM_CONTEXT_KEY: InjectionKey<CompositeItemContextValue> = Symbol('composite-item-context');

/**
 * Provide the composite item context (see `Combobox.Option`).
 */
export function provideCompositeItemContext(value: CompositeItemContextValue) {
    provide(COMPOSITE_ITEM_CONTEXT_KEY, value);
}

/**
 * Access the composite item context.
 * Must be used within a `Combobox.Option` `after` slot.
 * @throws Error if used outside of a `Combobox.Option`.
 * @returns The item context value.
 */
export function useCompositeItemContext(): CompositeItemContextValue {
    const context = inject(COMPOSITE_ITEM_CONTEXT_KEY);
    if (!context) {
        throw new Error('Combobox.Option sub-components must be used within a Combobox.Option `after` slot');
    }
    return context;
}
