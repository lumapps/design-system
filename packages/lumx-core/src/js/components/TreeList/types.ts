import type { CompositeHandle, CompositeOptions } from '../Composite/types';

/**
 * Options of {@link setupTreeList} (the composite options).
 * Without `focusOwner`, the tree is standalone: it owns focus and it has no filter.
 */
export type TreeListOptions = CompositeOptions;

/** State of a tree item, rendered by the tree item components. */
export interface TreeListItemState {
    /** Whether the parent item is open (always false on a leaf item). */
    isOpen: boolean;
    /** Whether the filter hides the tree item. */
    hidden: boolean;
}

/** Options of {@link TreeListHandle.registerTreeItem}. */
export interface TreeListItemOptions {
    /** Whether the tree item is a parent item (it has sub-items, or it loads them on open). */
    isParent(): boolean;
    /** Called on every open and close by the user (never for the initial state or for the filter). */
    onOpenChange?(isOpen: boolean): void;
    /** Called when the state changes. */
    onChange(state: TreeListItemState): void;
}

/** Controller of a registered tree item (see {@link TreeListHandle.registerTreeItem}). */
export interface TreeListItemController {
    /** The current state. */
    readonly state: TreeListItemState;
    /** Open or close the parent item (a user action: fires `onOpenChange`). Does nothing on a leaf item. */
    setOpen(isOpen: boolean): void;
    /** Toggle the parent item (a user action). */
    toggle(): void;
    /** Unregister the tree item and remove the listeners. */
    destroy(): void;
}

/**
 * Handle returned by {@link setupTreeList}: the composite handle (WAI-ARIA tree pattern), plus the
 * tree item registry.
 */
export interface TreeListHandle extends CompositeHandle {
    /**
     * Register a tree item root `<li>` element (what the React and Vue tree item components do on mount), and
     * get the controller of its open state. The tree item matches the filter on its own text (its
     * `[data-tree-label]` elements), never on its sub-items.
     *
     * The open state is internal to the controller:
     * - Initial state: open when a sub-item at any depth is selected (the closed groups stay mounted).
     * - Without a filter: the user state (toggle, Right, Left, a click on a non-selectable parent item…).
     * - During a filter: the parent items with a match below open. A user action lasts until the next
     *   change of the filter text. On clear, each parent item goes back to its state from before the
     *   filter, and the ancestors of the selected items stay open.
     * - On close, an active item inside the group moves to this tree item.
     *
     * The registry also sets `aria-busy` on the group while it holds only skeletons.
     */
    registerTreeItem(element: HTMLElement, options: TreeListItemOptions): TreeListItemController;
}
