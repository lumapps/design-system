import { type InjectionKey, type Ref, inject, provide } from 'vue';
import type { ListboxHandle } from '@lumx/core/js/components/Listbox/types';

/**
 * Context value shared by the listbox sub-components (list, options, sections, skeletons, state).
 *
 * Provided by `ListboxProvider` (standalone listbox) and by `Combobox.Provider` (listbox of a combobox),
 * then re-provided by the list with its `type`.
 */
export interface ListboxContextValue {
    /** The listbox handle (null inside a combobox until the trigger creates it). */
    list: Readonly<Ref<ListboxHandle | null>>;
    /** The ID of the listbox element. */
    listboxId: string;
    /** The pattern of the list. "grid" enables 2D keyboard navigation and action buttons on options. */
    type: 'listbox' | 'grid';
    /** The selection type of the list (from `aria-multiselectable`). Provided by the list. */
    selectionType?: 'single' | 'multiple';
}

const LISTBOX_CONTEXT_KEY: InjectionKey<ListboxContextValue> = Symbol('listbox-context');

/** Provide the listbox context (see `ListboxProvider` and `Combobox.Provider`). */
export function provideListboxContext(value: ListboxContextValue) {
    provide(LISTBOX_CONTEXT_KEY, value);
}

/**
 * Access the listbox context.
 * @throws Error outside a `ListboxProvider` or a `Combobox.Provider`.
 */
export function useListboxContext(): ListboxContextValue {
    const context = inject(LISTBOX_CONTEXT_KEY, null);
    if (!context) {
        throw new Error('Listbox sub-components must be used within a Combobox or a standalone listbox');
    }
    return context;
}
