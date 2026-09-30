import type { FocusNavigationController } from '../../utils/focusNavigation';

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

/** Event name for the active state of one option. */
export type OptionActiveEvent = `optionActive:${string}`;

/** Map of listbox event names to their payload types. */
export interface ListboxEventMap {
    /** Fired when the active descendant changes (visual focus). Payload: the option id or null. */
    activeDescendantChange: string | null;
    /**
     * Fired when the visible option count changes.
     * Payload: the number of visible options plus the current input value (combobox only).
     */
    optionsChange: { optionsLength: number; inputValue?: string } | undefined;
    /**
     * Fired immediately when the aggregate loading state changes (skeleton count transitions
     * between 0 and >0). Used for empty suppression in ListboxState and for aria-busy on the listbox.
     */
    loadingChange: boolean;
    /**
     * Fired after a 500ms debounce when loading persists while the options are visible,
     * or immediately when loading ends. Used to control the loading message text in the live region.
     */
    loadingAnnouncement: boolean;
    /**
     * Fired when the options become visible or hidden (see {@link ListboxHandle.setOpen}).
     * Inside a combobox, this is the combobox open state. A standalone listbox is open from
     * creation and never closes. Replayed on subscribe while open.
     */
    open: boolean;
    /**
     * Fired only when this option becomes the active descendant (true)
     * or stops being the active descendant (false).
     * Build the key with optionActiveEvent(optionId).
     */
    [event: OptionActiveEvent]: boolean;
}

/**
 * Link to a parent widget that owns focus (e.g. a combobox trigger).
 * Without it, the listbox is standalone and owns focus itself.
 * The parent observes the listbox through its events (`optionsChange`, `loadingChange`, `open`, …).
 */
export interface ListboxFocusOwnerLink {
    /** The element that holds DOM focus and `aria-activedescendant`. */
    getFocusOwner(): HTMLElement | null;
    /** Current input value, sent in the `optionsChange` payload. */
    getInputValue?(): string;
    /** Called after the listbox (or grid) element is mounted (e.g. to sync `aria-haspopup` on the trigger). */
    onMount?(element: HTMLElement): void;
}

/** Options of {@link setupListbox}. */
export interface ListboxOptions {
    /**
     * Called when an option is selected, or when the selection is cleared (see {@link ListboxHandle.select}).
     * `option.value` is the selected option value (empty string when clearing).
     * `element` is the selected option element (null when clearing).
     */
    onSelect?(option: { value: string }, element: HTMLElement | null): void;
    /** When true, ArrowDown/ArrowUp wrap around (list mode). Default: false. */
    wrapNavigation?: boolean;
    /** Parent focus owner. Omit for a standalone listbox. */
    focusOwner?: ListboxFocusOwnerLink;
}

/** Handle returned by {@link setupListbox}. */
export interface ListboxHandle {
    /**
     * Mount the listbox (or grid) element: create the focus navigation and the delegated
     * click/mousedown listeners. In standalone mode, also attach the keyboard and focus listeners.
     * Returns a cleanup function that unmounts it. Mounting another element unmounts the previous one.
     */
    mount(element: HTMLElement): () => void;
    /** Tear down all listeners and state. */
    destroy(): void;

    /** Subscribe to a listbox event. Returns an unsubscribe function. */
    subscribe<K extends keyof ListboxEventMap>(event: K, callback: (value: ListboxEventMap[K]) => void): () => void;
    /** Read the last dispatched value of an event (for pull-based subscribers). */
    getSnapshot<K extends keyof ListboxEventMap>(event: K): ListboxEventMap[K] | undefined;

    /** The mounted listbox/grid element. */
    readonly element: HTMLElement | null;
    /** Pattern of the mounted element: `'listbox'` or `'grid'` (null while not mounted). */
    readonly type: 'listbox' | 'grid' | null;
    /** The focus navigation controller (null while not mounted). */
    readonly focusNav: FocusNavigationController | null;
    /** Whether the listbox owns focus itself (no `focusOwner` link). */
    readonly isStandalone: boolean;
    /** Whether the options are visible (standalone: always; combobox: the open state). */
    readonly isOpen: boolean;
    /** Whether the listbox is in multi-select mode (`aria-multiselectable="true"`). */
    readonly isMultiSelect: boolean;
    /** Whether any skeleton placeholders are registered (loading). */
    readonly isLoading: boolean;
    /** Whether the listbox has visible options or skeletons. */
    readonly hasVisibleContent: boolean;

    /**
     * Set whether the options are visible (standalone: always visible; combobox: open state).
     * The loading announcement only fires while the options are visible.
     */
    setOpen(isOpen: boolean): void;
    /**
     * Select an option and fire `onSelect` with its value.
     * With `null`, clear the selection: `onSelect` receives an empty string value and a null element.
     */
    select(option: HTMLElement | null): void;
    /**
     * Handle the listbox navigation keys: arrows, Home/End, PageUp/PageDown, Enter, Space,
     * grid cells (ArrowLeft/ArrowRight) and typeahead. The only navigation implementation: a
     * standalone listbox calls it from its own keydown, a combobox calls it from the trigger keydown.
     * Returns true when the key was handled (Enter/Space need an active option, PageUp/PageDown too).
     */
    handleKeydown(event: KeyboardEvent): boolean;
    /**
     * Move the active cell left/right (grid pattern only, when there is an active cell).
     * Returns true when the key was handled.
     */
    navigateHorizontal(key: 'ArrowLeft' | 'ArrowRight'): boolean;
    /** Replay the pending navigation intent (see {@link FocusNavigationController.goTo}). */
    flushPendingNavigation(): void;

    /** Register an option element for filter notifications. Returns a cleanup function. */
    registerOption(element: HTMLElement, onFilterChange: (isFiltered: boolean) => void): () => void;
    /** Set the filter value and notify all registered options. */
    setFilter(filterValue: string): void;
    /** Re-evaluate the filter state of a single registered option. */
    refilterOption(element: HTMLElement): void;
    /** Register a section element for state notifications. Returns a cleanup function. */
    registerSection(element: HTMLElement, onChange: (state: SectionState) => void): () => void;
    /** Register a skeleton placeholder. Returns a cleanup function. */
    registerSkeleton(): () => void;
}
