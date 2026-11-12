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

/** Direction of a grid move. */
export type GridNavigationDirection = 'up' | 'down' | 'left' | 'right';

export interface GridNavigationOptions {
    type: 'grid';
    container: HTMLElement;
    rowSelector: string;
    /**
     * CSS selector of the cells. The column index of a cell is its position among the cells of its row
     * that match this selector, non-navigable cells included (e.g. blank cells of a calendar grid).
     */
    cellSelector: string;
    /**
     * CSS selector matching the cells that focus skips (disabled or blank cells). They keep their
     * position in the column index. Grid twin of `itemDisabledSelector` in the list navigation.
     *
     * - Left/Right skip non-navigable cells to the next navigable cell of the row. When there is none,
     *   the move goes past the row edge (see `onBoundary` and `wrap`).
     * - Up/Down target the cell at the remembered column in the adjacent row. When that cell is
     *   non-navigable, focus does not move (or `onBoundary` is called).
     */
    cellDisabledSelector?: string;
    /**
     * Wrap past the edges: Up/Down to the opposite row, Left/Right to the adjacent row.
     * Ignored when `onBoundary` is set.
     */
    wrap?: boolean;
    /**
     * Alternative to `wrap`: called when a move finds no navigable target in the grid:
     * - Up/Down past the first or last row,
     * - Up/Down onto a non-navigable cell of the adjacent row,
     * - Left/Right past the first or last navigable cell of the row.
     *
     * `activeCell` is the cell the move starts from. It stays active during the call.
     *
     * Return `true` when the consumer handles the move (the move then returns `true`): it typically
     * changes the DOM (e.g. renders the next page of the grid) and calls `goTo(resolver)`. When the target
     * is not in the DOM yet, `goTo` stores the resolver as the pending navigation, and
     * `flushPendingNavigation()` (to call after the render) replays it.
     *
     * Return `false` to cancel the move (no move, the move returns `false`).
     */
    onBoundary?: (direction: GridNavigationDirection, activeCell: HTMLElement) => boolean;
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
     * No-op when nothing is pending. In grid mode, any later move that activates a cell drops the
     * pending intent (the newer move wins).
     */
    flushPendingNavigation(): void;
}

export interface ListFocusNavigationController extends FocusNavigationController<ListFocusNavigationSelectors> {}

/**
 * Grid focus navigation controller. Adds the row Home/End moves.
 *
 * Grid first/last (Ctrl+Home/Ctrl+End) stay `goTo((s) => s.getFirst())` / `goTo((s) => s.getLast())`.
 */
export interface GridFocusNavigationController extends FocusNavigationController {
    readonly type: 'grid';
    /** Move to the first navigable cell of the active row. Returns `false` when there is no active cell. */
    goToRowStart(): boolean;
    /** Move to the last navigable cell of the active row. Returns `false` when there is no active cell. */
    goToRowEnd(): boolean;
}
