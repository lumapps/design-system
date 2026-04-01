import { type InjectionKey, type Ref, type ShallowRef, inject, provide } from 'vue';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';

/** Context value shared between Combobox sub-components. */
export interface ComboboxContextValue {
    /** The current ComboboxHandle (set by the trigger sub-component). */
    handle: ShallowRef<ComboboxHandle | null>;
    /** Setter for the handle (called by trigger on mount/unmount). */
    setHandle: (handle: ComboboxHandle | null) => void;
    /** The ID of the listbox element. */
    listboxId: string;
    /** Reference to the anchor element for popover positioning. */
    anchorRef: Ref<HTMLElement | null>;
}

const COMBOBOX_CONTEXT_KEY: InjectionKey<ComboboxContextValue> = Symbol('combobox-context');

/**
 * Provides the combobox context to sub-components.
 */
export function provideComboboxContext(value: ComboboxContextValue) {
    provide(COMBOBOX_CONTEXT_KEY, value);
}

/**
 * Hook to access the Combobox context.
 * @throws Error if used outside of a Combobox component.
 * @returns The combobox context value.
 */
export function useComboboxContext(): ComboboxContextValue {
    const context = inject(COMBOBOX_CONTEXT_KEY);
    if (!context) {
        throw new Error('Combobox sub-components must be used within a Combobox');
    }
    return context;
}
