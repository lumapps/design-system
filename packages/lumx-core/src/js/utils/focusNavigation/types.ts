export interface FocusNavigationCallbacks {
    onActivate(item: HTMLElement): void;
    onDeactivate(item: HTMLElement): void;
    onClear?(): void;
}

export interface ListNavigationOptions {
    type: 'list';
    container: HTMLElement;
    itemSelector: string;
    direction?: 'vertical' | 'horizontal';
    wrap?: boolean;
    itemDisabledSelector?: string;
    getActiveItem?: () => HTMLElement | null;
}

export interface GridNavigationOptions {
    type: 'grid';
    container: HTMLElement;
    rowSelector: string;
    cellSelector: string;
    isRowVisible?: (row: HTMLElement) => boolean;
    wrap?: boolean;
}

/** Pure, side-effect-free selection layer for focus navigation. */
export interface FocusNavigationSelectors {
    readonly activeItem: HTMLElement | null;
    readonly hasNavigableItems: boolean;
    getFirst(): HTMLElement | null;
    getLast(): HTMLElement | null;
    getMatching(predicate: (item: HTMLElement) => boolean): HTMLElement | null;
}

/**
 * List-specific selection layer.
 * Adds {@link findNearestEnabled} and the combined enabled-item selector string.
 */
export interface ListFocusNavigationSelectors extends FocusNavigationSelectors {
    readonly enabledItemSelector: string;
    findNearestEnabled(anchor: Node): HTMLElement | null;
}

/**
 * Focus navigation controller — the mover layer. Every method commits focus via
 * {@link FocusNavigationCallbacks}. The pure read layer lives behind {@link selectors}.
 *
 * To move focus to the first/last navigable item:
 * `goTo((s) => s.getFirst())` / `goTo((s) => s.getLast())`.
 */
export interface FocusNavigationController<Selectors extends FocusNavigationSelectors = FocusNavigationSelectors> {
    readonly type: 'list' | 'grid';
    readonly selectors: Selectors;

    goToItem(item: HTMLElement): boolean;
    goToOffset(offset: number): boolean;
    clear(): void;

    goUp(): boolean;
    goDown(): boolean;
    goLeft(): boolean;
    goRight(): boolean;

    /**
     * Navigate via a resolver, deferring when the target is not yet in the DOM.
     * ```ts
     * nav.goTo((sel) => sel.getMatching(isSelected) ?? sel.getFirst());
     * ```
     */
    goTo(resolve: (selectors: Selectors) => HTMLElement | null): boolean;
    /**
     * Replay the pending navigation intent stored by {@link goTo}.
     * No-op when nothing is pending.
     */
    flushPendingNavigation(): void;
}

export interface ListFocusNavigationController extends FocusNavigationController<ListFocusNavigationSelectors> {}
