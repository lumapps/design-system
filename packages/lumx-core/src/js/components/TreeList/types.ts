import type { CompositeHandle, CompositeOptions } from '../Composite/types';

/** Filter state of a tree item (computed by the tree list handle, see {@link TreeListHandle.registerTreeItem}). */
export interface TreeItemFilterState {
    /** The current filter text (empty string: no filter). */
    filter: string;
    /** Hidden by the auto filter: it does not match, and no tree item above or below it matches. */
    hidden: boolean;
    /** The own label or description of the tree item contains the filter text (auto filter only). */
    matching: boolean;
    /** A tree item below this one matches (auto filter), or it has rendered sub-items (manual filter). */
    hasMatchBelow: boolean;
}

/** Registration entry for a tree item element. */
export interface TreeItemRegistration {
    callback: (state: TreeItemFilterState) => void;
    /** The last notified state (null before the first notification). */
    last: TreeItemFilterState | null;
}

/**
 * Options of {@link setupTreeList} (the composite options).
 * Without `focusOwner`, the tree is standalone: it owns focus and it has no filter.
 */
export type TreeListOptions = CompositeOptions;

/**
 * Handle returned by {@link setupTreeList}: the composite handle (WAI-ARIA tree pattern), plus the
 * tree item registry.
 */
export interface TreeListHandle extends CompositeHandle<'tree'> {
    /**
     * Register a tree item root `<li>` element for filter notifications. Returns a cleanup function.
     * The tree item matches on its own text (its `[data-tree-label]` elements), never on its sub-items.
     * The callback is called at once with the current state.
     */
    registerTreeItem(element: HTMLElement, onChange: (state: TreeItemFilterState) => void): () => void;
}
