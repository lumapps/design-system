import { type InjectionKey, type Ref, inject, provide } from 'vue';
import type { CompositeHandle, CompositeType } from '@lumx/core/js/components/Composite/types';

/**
 * Context value shared by the sub-components of a composite widget (a list, a grid, …): the list,
 * its items, sections, skeletons and state.
 *
 * Provided by `ListboxProvider` (standalone listbox) and by `Combobox.Provider` (the list registered on
 * the combobox, with `comboboxListId`), then re-provided by the list with its `type`, without `comboboxListId`.
 */
export interface CompositeContextValue {
    /** The composite handle (null inside a combobox until a list registers). */
    handle: Readonly<Ref<CompositeHandle | null>>;
    /** The ID of the composite element. */
    id: string;
    /**
     * The pattern of the list. "grid" enables 2D keyboard navigation and action buttons on options.
     * Provided by the list element only: undefined above it (`ListboxProvider`, `Combobox.Provider`).
     */
    type?: CompositeType;
    /** The selection type of the list (from `aria-multiselectable`). Provided by the list. */
    selectionType?: 'single' | 'multiple';
    /** The nesting level of the items (0 or undefined: root items). A skeleton is nested when it is above 0. */
    level?: number;
    /**
     * The ID of the list of the combobox (the trigger `aria-controls` it). Set by `Combobox.Provider` only: a list
     * is the combobox list when its nearest composite context carries it. The list, its items and a nested
     * `ListboxProvider` provide their own context without it, so a list rendered inside them is standalone.
     * (At that level, it is the same value as `id`.)
     */
    comboboxListId?: string;
}

const COMPOSITE_CONTEXT_KEY: InjectionKey<CompositeContextValue> = Symbol('composite-context');

/** Provide the composite context (see `ListboxProvider` and `Combobox.Provider`). */
export function provideCompositeContext(value: CompositeContextValue) {
    provide(COMPOSITE_CONTEXT_KEY, value);
}

/** Access the composite context, or `undefined` outside of a composite widget (does not throw). */
export function useOptionalCompositeContext(): CompositeContextValue | undefined {
    return inject(COMPOSITE_CONTEXT_KEY, undefined);
}

/**
 * Access the composite context.
 * @throws Error outside a `ListboxProvider` or a `Combobox.Provider`.
 */
export function useCompositeContext(): CompositeContextValue {
    const context = useOptionalCompositeContext();
    if (!context) {
        throw new Error('Composite sub-components must be used within a Combobox or a standalone composite');
    }
    return context;
}
