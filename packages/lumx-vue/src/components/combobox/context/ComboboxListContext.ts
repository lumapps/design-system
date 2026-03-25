import { type InjectionKey, inject, provide } from 'vue';

/** Context value for the Combobox.List sub-tree. */
export interface ComboboxListContextValue {
    /** The popup type. "grid" enables 2D keyboard navigation and action buttons on options. */
    type: 'listbox' | 'grid';
}

const COMBOBOX_LIST_CONTEXT_KEY: InjectionKey<ComboboxListContextValue> = Symbol('combobox-list-context');

const DEFAULT_VALUE: ComboboxListContextValue = { type: 'listbox' };

/**
 * Provides the combobox list context.
 */
export function provideComboboxListContext(value: ComboboxListContextValue) {
    provide(COMBOBOX_LIST_CONTEXT_KEY, value);
}

/**
 * Hook to access the Combobox.List context (provides the `type`).
 * @returns The list context value.
 */
export function useComboboxListContext(): ComboboxListContextValue {
    return inject(COMBOBOX_LIST_CONTEXT_KEY, DEFAULT_VALUE);
}
