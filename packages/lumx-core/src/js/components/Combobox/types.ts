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

/** Map of combobox event names to their payload types. */
export interface ComboboxEventMap {
    /** Fired when the combobox open state changes. Payload: whether the combobox is open. */
    open: boolean;
    /** Fired when the active descendant changes (visual focus). Payload: the option id or null. */
    activeDescendantChange: string | null;
    /**
     * Fired when the visible option count transitions between empty and non-empty.
     * Payload: whether the list is empty plus the current input value.
     */
    emptyChange: { isEmpty?: boolean; inputValue?: string } | undefined;
    /**
     * Fired immediately when the aggregate loading state changes (skeleton count transitions
     * between 0 and >0). Used for empty suppression in ComboboxState and for aria-busy on the listbox.
     */
    loadingChange: boolean;
    /**
     * Fired after a 500ms debounce when loading persists, or immediately when loading ends.
     * Used to control the loading message text in the live region (ComboboxState).
     */
    loadingAnnouncement: boolean;
}

/** Callbacks provided by the consumer (React/Vue) to react to combobox state changes. */
export interface ComboboxCallbacks {
    /** Called when an option is selected (click or keyboard). */
    onSelect(option: { value: string }): void;
}

/** Handle returned by `setupCombobox`. Used by framework wrappers and mode controllers. */
export interface ComboboxHandle {
    /** Register the trigger element. Returns a cleanup function. */
    registerTrigger(trigger: HTMLInputElement | HTMLButtonElement): () => void;
    /** Register the listbox/grid element. Returns a cleanup function. */
    registerListbox(listbox: HTMLElement): () => void;
    /** Tear down all listeners and state. */
    destroy(): void;

    /** Subscribe to a combobox event. Returns an unsubscribe function. */
    subscribe<K extends keyof ComboboxEventMap>(event: K, callback: (value: ComboboxEventMap[K]) => void): () => void;

    /** The current trigger element (may be null before registration). */
    readonly trigger: HTMLInputElement | HTMLButtonElement | null;
    /** The current listbox/grid element (may be null before registration). */
    readonly listbox: HTMLElement | null;
    /** The focus navigation controller. */
    readonly focusNav: FocusNavigationController | null;
    /** Whether the popup is open. */
    readonly isOpen: boolean;
    /** Whether multi-select mode. */
    readonly isMultiSelect: boolean;
    /** Whether any skeleton placeholders are currently registered (loading). */
    readonly isLoading: boolean;

    /** Set the open state, update ARIA, fire callback. */
    setIsOpen(isOpen: boolean): void;
    /** Select an option (or null to clear), fire callback. */
    select(option: HTMLElement | null): void;

    /**
     * Register an option DOM element for filter notifications.
     * The element's textContent is used as the searchable text.
     * The callback is invoked immediately with the current filter state,
     * and again whenever the filter changes.
     * Returns a cleanup function that unregisters the option.
     */
    registerOption(element: HTMLElement, onFilterChange: (isFiltered: boolean) => void): () => void;
    /**
     * Set the current filter value and notify all registered options of their match state.
     * Options whose text does not start with the filter value are notified with isFiltered=true.
     * An empty filter value clears filtering (all options become visible).
     */
    setFilter(filterValue: string): void;
    /**
     * Register a section DOM element for state notifications.
     * The callback is invoked immediately with the current state, and again whenever
     * the state changes after a filter update or option un/registration.
     *
     * - `hidden`: true when all registered options are filtered out (keeps children mounted
     *   but invisible to the user and screen readers).
     * - `aria-hidden`: true when the section has no registered options at all (skeleton-only).
     *   The section stays visually rendered but is hidden from assistive technology —
     *   the live region (`ComboboxState`) handles the loading announcement instead.
     *
     * At most one of `hidden` / `aria-hidden` is true at a time.
     *
     * Returns a cleanup function that unregisters the section.
     */
    registerSection(
        element: HTMLElement,
        onChange: (state: { hidden: boolean; 'aria-hidden': boolean }) => void,
    ): () => void;
    /**
     * Register a skeleton placeholder. Increments the internal skeleton counter.
     * When the counter transitions from 0 to >0, fires `loadingChange` immediately
     * and schedules `loadingAnnouncement` after 500ms. Returns a cleanup function
     * that decrements the counter (and fires the reverse transitions when reaching 0).
     */
    registerSkeleton(): () => void;
}

/**
 * Callback invoked when the trigger is attached and the abort controller is ready.
 *
 * The callback can optionally return a mode-specific keydown hook. When returned,
 * it is called before the shared keydown handler; return `true` to indicate the
 * event was handled (the caller will call `stopPropagation`/`preventDefault`)
 * and skip the shared logic.
 */
export type OnTriggerAttach = (
    handle: ComboboxHandle,
    signal: AbortSignal,
) => ((event: KeyboardEvent) => boolean) | void;
