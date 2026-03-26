/**
 * Callbacks for focus state changes.
 * The consumer decides how to manifest focus (roving tabindex, aria-activedescendant, etc.).
 */
export interface FocusNavigationCallbacks {
    /** Called when an item becomes the active (focused) item. */
    onActivate(item: HTMLElement): void;
    /** Called when an item is no longer the active item (being replaced or cleared). */
    onDeactivate(item: HTMLElement): void;
    /** Called when focus is completely cleared (no active item). */
    onClear?(): void;
}

/** Options for 1D list navigation. */
export interface ListNavigationOptions {
    type: 'list';
    /** The container element to scan for items. */
    container: HTMLElement;
    /** CSS selector to identify navigable items within the container. */
    itemSelector: string;
    /**
     * Primary navigation axis — determines which arrow keys navigate the list.
     * - `'vertical'` (default): Up/Down navigate, Left/Right are no-ops.
     * - `'horizontal'`: Left/Right navigate, Up/Down are no-ops.
     */
    direction?: 'vertical' | 'horizontal';
    /** Whether navigation wraps at boundaries (last→first, first→last). Default: false. */
    wrap?: boolean;
    /**
     * CSS selector matching disabled items within the container.
     * Disabled items are skipped during navigation (goUp/goDown/goLeft/goRight/goToFirst/goToLast)
     * but can still be navigated to directly via `goToItem`.
     * Default: no items are disabled.
     */
    itemDisabledSelector?: string;
    /**
     * CSS selector identifying the initially active item within the container.
     * If an item matching this selector is found on setup, it becomes the active item
     * without triggering focus or activation callbacks (silent init from DOM state).
     */
    itemActiveSelector?: string;
}

/** Options for 2D grid navigation. */
export interface GridNavigationOptions {
    type: 'grid';
    /** The container element (grid root) to scan for rows and cells. */
    container: HTMLElement;
    /** CSS selector to identify row elements within the container. */
    rowSelector: string;
    /** CSS selector to identify cell elements within each row. */
    cellSelector: string;
    /**
     * Predicate to determine if a row should be included in navigation.
     * Rows for which this returns `false` are skipped.
     * Default: all rows are visible.
     */
    isRowVisible?: (row: HTMLElement) => boolean;
    /** Whether navigation wraps at boundaries. Default: false. */
    wrap?: boolean;
}

/** Union of all navigation option types. */
export type NavigationOptions = ListNavigationOptions | GridNavigationOptions;

// ─── Focus navigation controller ───────────────────────────────────

/** Focus navigation controller interface — works for both 1D lists and 2D grids. */
export interface FocusNavigationController {
    /** The navigation structure type. */
    readonly type: 'list' | 'grid';
    /** The currently active item, or null if no item is active. */
    readonly activeItem: HTMLElement | null;
    /** Whether an item is currently active. */
    readonly hasActiveItem: boolean;
    /** Whether there are any navigable items in the container. */
    readonly hasNavigableItems: boolean;

    /** Navigate to the first navigable item. */
    goToFirst(): boolean;
    /** Navigate to the last navigable item. */
    goToLast(): boolean;
    /**
     * Navigate to a specific item element.
     * @returns true if navigation occurred (item is navigable).
     */
    goToItem(item: HTMLElement): boolean;
    /**
     * Navigate by offset from the current item.
     * In list mode, moves by items. In grid mode, moves by rows.
     * Positive offsets move forward/down, negative move backward/up.
     */
    goToOffset(offset: number): boolean;
    /**
     * Navigate to the first item matching a predicate.
     * @returns true if a matching item was found and focused.
     */
    goToItemMatching(predicate: (item: HTMLElement) => boolean): boolean;
    /** Clear the active item — no item is active after this call. */
    clear(): void;

    /** Navigate up (previous item in vertical list, previous row in grid). */
    goUp(): boolean;
    /** Navigate down (next item in vertical list, next row in grid). */
    goDown(): boolean;
    /** Navigate left (previous item in horizontal list, previous cell in grid). */
    goLeft(): boolean;
    /** Navigate right (next item in horizontal list, next cell in grid). */
    goRight(): boolean;
}
