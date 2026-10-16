import type { FocusNavigationCallbacks, FocusNavigationController } from '../../utils/focusNavigation';

/**
 * Pattern of a mounted composite element (from its role): each composite specialization
 * (see {@link setupComposite}) adds its own patterns (listbox: `'listbox'` and `'grid'`, tree list: `'tree'`).
 */
export type CompositeType = 'listbox' | 'grid' | 'tree';

/** Mode of the filter (see {@link CompositeHandle.setFilter}). */
export type CompositeFilterMode = 'auto' | 'manual';

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
     * between 0 and >0). Used for empty suppression in ListboxState and for aria-busy on the list.
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
     * creation and never closes. Replayed on subscribe while open.
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
 * The parent observes the composite through its events (`optionsChange`, `loadingChange`, `open`, …).
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
    /** The mounted composite element. */
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
export interface CompositeNavigation<T extends CompositeType = CompositeType> {
    /** Pattern of the mounted element. */
    readonly type: T;
    /** The focus navigation controller. */
    readonly focusNav: FocusNavigationController;
    /** Selector of the elements that can become active (options, grid cells, …). */
    readonly cellSelector: string;
    /**
     * Selector of other elements (not cells) whose mousedown must not move DOM focus away from the
     * focus owner (e.g. an expand toggle next to a tree item).
     */
    readonly keepFocusSelector?: string;
    /** Whether a clicked cell selects its item (e.g. false for grid action cells). */
    isOptionCell(cell: HTMLElement): boolean;
    /**
     * Find the cell of a pressed or clicked element (e.g. the tree item of an expand toggle that covers its row).
     * Default: the closest element that matches {@link cellSelector}.
     */
    getCellFromTarget?(target: HTMLElement): HTMLElement | null;
    /** Scroll the active item into view. */
    scrollIntoView(item: HTMLElement): void;
    /**
     * Move the active item left/right (when the pattern has a horizontal navigation and there is an active item).
     * Returns true when the key was handled, even when nothing changed.
     */
    navigateHorizontal(key: 'ArrowLeft' | 'ArrowRight'): boolean;
    /**
     * Handle ArrowLeft/ArrowRight from {@link CompositeHandle.handleKeydown}. Returns true when the key is consumed.
     * Default: {@link navigateHorizontal}.
     */
    handleHorizontalKey?(key: 'ArrowLeft' | 'ArrowRight'): boolean;
}

/**
 * What a composite specialization (listbox, …) gives to {@link setupComposite}:
 * its navigation modules, its item count and its filter.
 */
export interface CompositeSpecialization<T extends CompositeType = CompositeType> {
    /** Create the navigation module of the mounted element (selected from its role). */
    createNavigation(element: HTMLElement, options: CompositeNavigationOptions): CompositeNavigation<T>;
    /** Number of visible items (`optionsChange` payload and `hasVisibleContent`). */
    getVisibleCount(): number;
    /** Whether the item count must not be announced (`optionsChange` payload). Default: false. */
    isCountHidden?(): boolean;
    /**
     * Apply the filter (see {@link CompositeHandle.setFilter}). The composite fires `optionsChange` after it
     * when the visible count changed.
     */
    setFilter(filterValue: string, mode: CompositeFilterMode): void;
    /** Called after the element is mounted, to attach the specialization listeners (removed on `signal` abort). */
    onMount?(element: HTMLElement, navigation: CompositeNavigation<T>, signal: AbortSignal): void;
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
export interface CompositeHandle<T extends CompositeType = CompositeType> extends CompositeEventSource {
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
    readonly type: T | null;
    /** The focus navigation controller (null while not mounted). */
    readonly focusNav: FocusNavigationController | null;
    /** Whether the composite owns focus itself (no `focusOwner` link). */
    readonly isStandalone: boolean;
    /** Whether the items are visible (standalone: always; combobox: the open state). */
    readonly isOpen: boolean;
    /** Whether the composite is in multi-select mode (`aria-multiselectable="true"`). */
    readonly isMultiSelect: boolean;
    /** Whether any root skeleton placeholders are registered (loading). */
    readonly isLoading: boolean;
    /** Whether the composite has visible items or skeletons. */
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
     * Returns true when the key was handled (Enter/Space need an active item, PageUp/PageDown too).
     */
    handleKeydown(event: KeyboardEvent): boolean;
    /**
     * Move the active item left/right (see {@link CompositeNavigation.navigateHorizontal}).
     * Returns true when the key was handled.
     */
    navigateHorizontal(key: 'ArrowLeft' | 'ArrowRight'): boolean;
    /** Replay the pending navigation intent (see {@link FocusNavigationController.goTo}). */
    flushPendingNavigation(): void;

    /**
     * Set the filter value. The specialization applies it:
     * - `'auto'` (default): hide the items that do not match.
     * - `'manual'`: the consumer renders the result (the specialization hides nothing).
     */
    setFilter(filterValue: string, mode?: CompositeFilterMode): void;
    /**
     * Register a skeleton placeholder. Returns a cleanup function.
     * A root skeleton makes the composite busy (`loadingChange`, `isLoading`). A nested skeleton
     * (`isNested`, inside a nested level of items) does not make it busy, but it starts the loading
     * announcement.
     */
    registerSkeleton(options?: { isNested?: boolean }): () => void;
}
