import type {
    CompositeEventMap,
    CompositeFocusOwnerLink,
    CompositeHandle,
    CompositeOptions,
    OptionActiveEvent,
} from '../Composite/types';

export type { OptionActiveEvent };

/** Pattern of a mounted listbox element (from its role): `'listbox'` or `'grid'`. */
export type ListboxType = 'listbox' | 'grid';

/** Section visibility state tracked per registration. */
export interface SectionState {
    hidden: boolean;
    'aria-hidden': boolean;
}

/** Registration entry for a section element. */
export interface SectionRegistration {
    callback: (state: SectionState) => void;
    last: SectionState;
}

/** Registration entry for an option element. */
export interface OptionRegistration {
    callback: (isFiltered: boolean) => void;
    lastFiltered: boolean;
}

/** Map of listbox event names to their payload types (the composite events). */
export type ListboxEventMap = CompositeEventMap;

/** Link to a parent widget that owns focus (see {@link CompositeFocusOwnerLink}). */
export type ListboxFocusOwnerLink = CompositeFocusOwnerLink;

/** Options of {@link setupListbox} (the composite options). */
export type ListboxOptions = CompositeOptions;

/**
 * Handle returned by {@link setupListbox}: the composite handle (WAI-ARIA listbox or grid pattern),
 * plus the option and section registry.
 */
export interface ListboxHandle extends CompositeHandle<ListboxType> {
    /** Register an option element for filter notifications. Returns a cleanup function. */
    registerOption(element: HTMLElement, onFilterChange: (isFiltered: boolean) => void): () => void;
    /** Re-evaluate the filter state of a single registered option. */
    refilterOption(element: HTMLElement): void;
    /** Register a section element for state notifications. Returns a cleanup function. */
    registerSection(element: HTMLElement, onChange: (state: SectionState) => void): () => void;
}
