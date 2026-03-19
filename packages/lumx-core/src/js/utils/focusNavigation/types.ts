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

/** Focus navigation controller interface for 1D lists. */
export interface FocusNavigationController {
    /** The navigation structure type. */
    readonly type: 'list';
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
     * Positive offsets move forward, negative move backward.
     */
    goToOffset(offset: number): boolean;
    /**
     * Navigate to the first item matching a predicate.
     * @returns true if a matching item was found and focused.
     */
    goToItemMatching(predicate: (item: HTMLElement) => boolean): boolean;
    /** Clear the active item — no item is active after this call. */
    clear(): void;

    /** Navigate up (previous item in vertical list). */
    goUp(): boolean;
    /** Navigate down (next item in vertical list). */
    goDown(): boolean;
    /** Navigate left (previous item in horizontal list). */
    goLeft(): boolean;
    /** Navigate right (next item in horizontal list). */
    goRight(): boolean;
}
