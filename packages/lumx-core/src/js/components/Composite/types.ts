import type { FocusNavigationCallbacks, FocusNavigationController } from '../../utils/focusNavigation';

/**
 * Pattern of a mounted composite element (from its role, e.g. `'listbox'` or `'grid'`): each composite
 * specialization (see {@link setupComposite}) defines its own patterns.
 */
export type CompositeType = string;

/** Mode of the filter (see {@link CompositeHandle.setFilter}). */
export type CompositeFilterMode = 'auto' | 'manual';

/** The current filter of a composite (see {@link CompositeHandle.setFilter}). */
export interface CompositeFilter {
    /** Filter value (empty string: no filter). */
    value: string;
    /** Filter mode (`'manual'`: the consumer renders the result, the specialization hides nothing). */
    mode: CompositeFilterMode;
}

/** Event name for the active state of one item. */
export type OptionActiveEvent = `optionActive:${string}`;

/** Map of composite event names to their payload types. */
export interface CompositeEventMap {
    /** Fired when the active descendant changes (visual focus). Payload: the active item id or null. */
    activeDescendantChange: string | null;
    /**
     * Fired when the visible item count changes.
     * Payload: the number of visible items plus the current input value (combobox only), and whether
     * the item count must not be announced (set by the composite specialization).
     */
    optionsChange: { optionsLength: number; inputValue?: string; isCountHidden?: boolean } | undefined;
    /**
     * Fired immediately when the aggregate loading state changes (root skeleton count transitions
     * between 0 and >0). Used for empty suppression in the status and for `aria-busy` on the list.
     */
    loadingChange: boolean;
    /**
     * Fired after a 500ms debounce when loading persists while the items are visible,
     * or immediately when loading ends. Used to control the loading message text in the live region.
     */
    loadingAnnouncement: boolean;
    /**
     * Fired when the items become visible or hidden (see {@link CompositeHandle.setOpen}).
     * Inside a combobox, this is the combobox open state. A standalone composite is open from
     * creation and never closes.
     */
    open: boolean;
    /**
     * Fired only when this item becomes the active descendant (true)
     * or stops being the active descendant (false).
     * Build the key with optionActiveEvent(itemId).
     */
    [event: OptionActiveEvent]: boolean;
}

/**
 * Link to a parent widget that owns focus (e.g. a combobox trigger).
 * Without it, the composite is standalone and owns focus itself.
 * The parent sets the open state ({@link CompositeHandle.setOpen}) and observes the composite through its
 * events (e.g. `optionsChange`).
 */
export interface CompositeFocusOwnerLink {
    /** The element that holds DOM focus and `aria-activedescendant`. */
    getFocusOwner(): HTMLElement | null;
    /** Current input value, sent in the `optionsChange` payload. */
    getInputValue?(): string;
    /** Called after the composite element is mounted (e.g. to sync `aria-haspopup` on the trigger). */
    onMount?(element: HTMLElement): void;
}

/** Options of {@link setupComposite} (and of its specializations). */
export interface CompositeOptions {
    /**
     * Called when an item is selected, or when the selection is cleared (see {@link CompositeHandle.select}).
     * `option.value` is the selected item value (empty string when clearing).
     * `element` is the selected item element (null when clearing).
     */
    onSelect?(option: { value: string }, element: HTMLElement | null): void;
    /** When true, ArrowDown/ArrowUp wrap around (list mode). Default: false. */
    wrapNavigation?: boolean;
    /** Parent focus owner. Omit for a standalone composite. */
    focusOwner?: CompositeFocusOwnerLink;
}

/** Options given to the navigation module of a composite specialization on mount. */
export interface CompositeNavigationOptions {
    /** The mounted composite element (the navigation module is selected from its role). */
    container: HTMLElement;
    /** Focus state change callbacks (visual focus + `aria-activedescendant`). */
    callbacks: FocusNavigationCallbacks;
    /** Abort signal (unmount). */
    signal: AbortSignal;
    /** Read the active item (from the focus owner `aria-activedescendant`). */
    getActiveItem: () => HTMLElement | null;
    /** When true, ArrowDown/ArrowUp wrap around (list mode only). */
    wrap?: boolean;
}

/**
 * Navigation module of a mounted composite: everything that differs between the patterns
 * (listbox, grid, …). Created by the composite specialization from the mounted element.
 */
export interface CompositeNavigation {
    /** Pattern of the mounted element. */
    readonly type: CompositeType;
    /** The focus navigation controller. */
    readonly focusNav: FocusNavigationController;
    /** Selector of the elements that can become active (options, grid cells, …). */
    readonly cellSelector: string;
    /** Whether a clicked cell selects its item (e.g. false for grid action cells). */
    isOptionCell(cell: HTMLElement): boolean;
    /** Scroll the active item into view. */
    scrollIntoView(item: HTMLElement): void;
    /**
     * Handle ArrowLeft/ArrowRight on the active item (when the pattern has a horizontal navigation: e.g. move
     * between the grid cells, open or close a tree item). Returns true when the key was handled (an active item
     * exists and the pattern handles the key), even when nothing changed. Without an active item, the key is
     * not handled: a standalone composite consumes it anyway, a combobox input moves its caret
     * (see {@link CompositeHandle.handleKeydown}).
     */
    navigateHorizontal(key: 'ArrowLeft' | 'ArrowRight'): boolean;
}

/**
 * What a composite specialization (listbox, …) gives to {@link setupComposite}:
 * its navigation modules, its item count and its filter.
 */
export interface CompositeSpecialization {
    /** Create the navigation module of the mounted element (`options.container`, selected from its role). */
    createNavigation(options: CompositeNavigationOptions): CompositeNavigation;
    /** Number of visible items with the current filter (`optionsChange` payload and `hasVisibleContent`). */
    getVisibleCount(filter: CompositeFilter): number;
    /** Whether the item count must not be announced with the current filter (`optionsChange` payload). Default: false. */
    isCountHidden?(filter: CompositeFilter): boolean;
    /**
     * Apply the new filter (see {@link CompositeHandle.setFilter}). The composite stores it (see
     * {@link CompositeSetup.getFilter}), and fires `optionsChange` after it when the visible count changed.
     */
    applyFilter(filter: CompositeFilter): void;
    /** Called after the element is mounted, to attach the specialization listeners (removed on `signal` abort). */
    onMount?(element: HTMLElement, signal: AbortSignal): void;
    /** Clear the specialization state (see {@link CompositeHandle.destroy}). */
    destroy?(): void;
}

/** Read-only event source of a composite handle (`subscribe` + `getSnapshot`). */
export interface CompositeEventSource<M = CompositeEventMap> {
    /** Subscribe to an event. Returns an unsubscribe function. */
    subscribe<K extends keyof M>(event: K, callback: (value: M[K]) => void): () => void;
    /** Read the last dispatched value of an event (for pull-based subscribers). */
    getSnapshot<K extends keyof M>(event: K): M[K] | undefined;
}

/**
 * Handle returned by {@link setupComposite}: the behavior shared by the composite widgets
 * (one active item among many: listbox, grid, …).
 */
export interface CompositeHandle extends CompositeEventSource {
    /**
     * Mount the composite element: create the focus navigation and the delegated click/mousedown
     * listeners. In standalone mode, also attach the keyboard and focus listeners.
     * Returns a cleanup function that unmounts it. Mounting another element unmounts the previous one.
     */
    mount(element: HTMLElement): () => void;
    /** Tear down all listeners and state. */
    destroy(): void;

    /** The mounted composite element. */
    readonly element: HTMLElement | null;
    /** Pattern of the mounted element (null while not mounted). */
    readonly type: CompositeType | null;
    /** The active item (null while there is none, or while not mounted). */
    readonly activeItem: HTMLElement | null;
    /** Whether the composite owns focus itself (no `focusOwner` link). */
    readonly isStandalone: boolean;
    /** Whether the items are visible (standalone: always; combobox: the open state). */
    readonly isOpen: boolean;
    /** Whether the composite is in multi-select mode (`aria-multiselectable="true"`). */
    readonly isMultiSelect: boolean;
    /**
     * Whether the composite has visible items or root skeletons. Without them, the mounted element gets
     * `hidden` (unless it holds a status: the live region, e.g. a `Combobox.State` inside the list).
     */
    readonly hasVisibleContent: boolean;

    /**
     * Set whether the items are visible (standalone: always visible; combobox: open state).
     * The loading announcement only fires while the items are visible.
     */
    setOpen(isOpen: boolean): void;
    /**
     * Select an item and fire `onSelect` with its value.
     * With `null`, clear the selection: `onSelect` receives an empty string value and a null element.
     */
    select(option: HTMLElement | null): void;
    /**
     * Handle the navigation keys: arrows, Home/End, PageUp/PageDown, Enter, Space,
     * ArrowLeft/ArrowRight (delegated to the navigation module) and typeahead. The only navigation
     * implementation: a standalone composite calls it from its own keydown, a combobox calls it from
     * the trigger keydown.
     * Returns true when the key was handled: ArrowDown/ArrowUp/Home/End always; Enter/Space and
     * PageUp/PageDown with an active item; ArrowLeft/ArrowRight always in a standalone composite, and in a
     * linked one only when the navigation module handled them.
     */
    handleKeydown(event: KeyboardEvent): boolean;
    /** Replay the pending navigation intent (see {@link activateDefaultItem}). */
    flushPendingNavigation(): void;

    /** Clear the active item and discard the pending navigation intent. No-op while not mounted. */
    clearActiveItem(): void;
    /** Make an item active. No-op while not mounted. */
    setActiveItem(item: HTMLElement): void;
    /**
     * Make the first selected item active, or else the first (`'first'`) or the last (`'last'`) item.
     * When no item can become active yet (e.g. the combobox popup is opening and its items are not
     * rendered), keep the intent until {@link flushPendingNavigation}. No-op while not mounted.
     */
    activateDefaultItem(edge: 'first' | 'last'): void;

    /**
     * Set the filter value. The specialization applies it:
     * - `'auto'` (default): hide the items that do not match.
     * - `'manual'`: the consumer renders the result (the specialization hides nothing).
     */
    setFilter(filterValue: string, mode?: CompositeFilterMode): void;
    /**
     * Register a skeleton placeholder. Returns a cleanup function (a second call does nothing).
     * A root skeleton makes the composite busy (`loadingChange`). A nested skeleton
     * (`isNested`, inside a nested level of items) does not make it busy, but it starts the loading
     * announcement.
     */
    registerSkeleton(options?: { isNested?: boolean }): () => void;
}
