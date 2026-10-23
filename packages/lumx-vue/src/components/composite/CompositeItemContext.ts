import { type InjectionKey, inject, provide } from 'vue';

/** Context value provided by Combobox.Option to its `after` slot children. */
export interface ListboxOptionContextValue {
    /** The ID of the parent option element (matches the aria-activedescendant value when highlighted). */
    optionId: string;
    /** Whether the parent option is selected. */
    isSelected: boolean;
}

const COMBOBOX_OPTION_CONTEXT_KEY: InjectionKey<ListboxOptionContextValue> = Symbol('combobox-option-context');

/**
 * Provides the combobox option context.
 */
export function provideListboxOptionContext(value: ListboxOptionContextValue) {
    provide(COMBOBOX_OPTION_CONTEXT_KEY, value);
}

/**
 * Hook to access the Combobox.Option context.
 * Must be used within a Combobox.Option's `after` slot.
 * @throws Error if used outside of a Combobox.Option.
 * @returns The option context value.
 */
export function useListboxOptionContext(): ListboxOptionContextValue {
    const context = inject(COMBOBOX_OPTION_CONTEXT_KEY);
    if (!context) {
        throw new Error('Combobox.Option sub-components must be used within a Combobox.Option `after` slot');
    }
    return context;
}
