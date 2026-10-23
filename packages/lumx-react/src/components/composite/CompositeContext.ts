import { createContext, useContext } from 'react';
import type { CompositeHandle, CompositeType } from '@lumx/core/js/components/Composite/types';

/**
 * Context value shared by the sub-components of a composite widget (a list, a grid, …): the list,
 * its items, sections, skeletons and state.
 *
 * Provided by `ListboxProvider` (standalone listbox) and by `Combobox.Provider` (listbox of a combobox),
 * then re-provided by the list with its `type`.
 */
export interface CompositeContextValue {
    /** The composite handle (null inside a combobox until the trigger creates it). */
    handle: CompositeHandle | null;
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
}

export const CompositeContext = createContext<CompositeContextValue | undefined>(undefined);

/** Access the composite context, if any (undefined outside a `ListboxProvider` or a `Combobox.Provider`). */
export function useOptionalCompositeContext(): CompositeContextValue | undefined {
    return useContext(CompositeContext);
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
