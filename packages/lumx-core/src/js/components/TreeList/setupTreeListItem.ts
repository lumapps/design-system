import { CLASSNAME as SKELETON_CLASSNAME } from '../Listbox/ListboxOptionSkeleton';
import { TREE_ITEM_TOGGLE_EVENT } from './navigation';
import type { TreeItemFilterState, TreeListHandle } from './types';
import { getTreeListItemGroupId } from './TreeListItem';

/** State of a tree item, rendered by the tree item components. */
export interface TreeListItemState {
    /** Whether the parent item is open (always false on a leaf item). */
    isOpen: boolean;
    /** Whether the filter hides the tree item. */
    hidden: boolean;
}

/** Options of {@link setupTreeListItem}. */
export interface SetupTreeListItemOptions {
    /** The tree list handle (see `setupTreeList`). */
    tree: TreeListHandle;
    /** The root `<li>` element of the tree item. */
    element: HTMLElement;
    /** The ID of the tree item element (`role="treeitem"`), as rendered by the `TreeListItem` template. */
    id: string;
    /** Whether the tree item is a parent item (it has sub-items, or it loads them on open). */
    isParent(): boolean;
    /** Called on every open and close by the user (never for the initial state or for the filter). */
    onOpenChange?(isOpen: boolean): void;
    /** Called when the state changes. */
    onChange(state: TreeListItemState): void;
}

/** Controller returned by {@link setupTreeListItem}. */
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

const SELECTED_SELECTOR = '[aria-selected="true"]';

/**
 * Set up the open state of a tree item (shared by the React and Vue tree item components).
 *
 * The open state is internal:
 * - Initial state: open when a sub-item at any depth is selected (the closed groups stay mounted).
 * - Without a filter: the user state (toggle, Right, Left, a click on a non-selectable parent item…).
 * - During a filter: the parent items with a match below open. A user action lasts until the next
 *   change of the filter text. On clear, each parent item goes back to its state from before the
 *   filter, and the ancestors of the selected items stay open.
 * - On close, an active item inside the group moves to this tree item.
 *
 * It also registers the tree item for the filter (see `TreeListHandle.registerTreeItem`), listens to
 * the open and close requests of the keyboard navigation (`TREE_ITEM_TOGGLE_EVENT`), and sets
 * `aria-busy` on the group while it holds only skeletons.
 */
export function setupTreeListItem(options: SetupTreeListItemOptions): TreeListItemController {
    const { tree, element, id, isParent, onOpenChange, onChange } = options;
    // Look inside the element (not in the document): Vue sets up the item before it is attached.
    const getTreeItem = () => element.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    const getGroup = () => element.querySelector<HTMLElement>(`#${CSS.escape(getTreeListItemGroupId(id))}`);

    const hasSelectedBelow = () => Boolean(getGroup()?.querySelector(SELECTED_SELECTOR));

    let filterState: TreeItemFilterState = { filter: '', hidden: false, matching: false, hasMatchBelow: false };
    /** Open state set by the user (or the initial state) without a filter. */
    let userOpen = hasSelectedBelow();
    /** Open state set by the user during a filter (lasts until the next change of the filter text). */
    let filterOverride: { filter: string; isOpen: boolean } | null = null;
    /**
     * True from a filter clear to the next frame: the open state does not change meanwhile. A selection
     * clears the filter before the framework renders the new `aria-selected`, so the open state after
     * the clear (which keeps the ancestors of the selected items open) is only known on the next frame.
     */
    let isRestoring = false;
    let state: TreeListItemState = { isOpen: false, hidden: false };

    function computeState(): TreeListItemState {
        const { filter, hasMatchBelow, hidden } = filterState;
        if (isRestoring) return { isOpen: state.isOpen, hidden };
        let isOpen = false;
        if (isParent()) {
            if (!filter) isOpen = userOpen;
            else if (filterOverride?.filter === filter) isOpen = filterOverride.isOpen;
            else isOpen = hasMatchBelow;
        }
        return { isOpen, hidden };
    }

    state = computeState();

    /** Move an active item inside the (closed) group to this tree item. */
    function moveActiveItemOutOfGroup() {
        const activeItem = tree.focusNav?.selectors.activeItem;
        const treeItem = getTreeItem();
        if (treeItem && activeItem && getGroup()?.contains(activeItem)) tree.focusNav?.goTo(() => treeItem);
    }

    function update() {
        const next = computeState();
        if (next.isOpen === state.isOpen && next.hidden === state.hidden) return;
        const isClosing = state.isOpen && !next.isOpen;
        state = next;
        onChange(state);
        if (isClosing) moveActiveItemOutOfGroup();
    }

    function setOpen(isOpen: boolean) {
        if (!isParent() || isOpen === state.isOpen) return;
        const { filter } = filterState;
        if (filter) filterOverride = { filter, isOpen };
        else userOpen = isOpen;
        update();
        onOpenChange?.(isOpen);
    }

    /** After a filter clear: back to the state before the filter, but the ancestors of the selected items stay open. */
    function restoreAfterClear() {
        isRestoring = false;
        if (!filterState.filter && hasSelectedBelow()) userOpen = true;
        update();
    }

    let clearFrame: number | undefined;
    const unregister = tree.registerTreeItem(element, (nextFilterState) => {
        const isCleared = Boolean(filterState.filter) && !nextFilterState.filter;
        filterState = nextFilterState;
        if (isCleared) {
            isRestoring = true;
            cancelAnimationFrame(clearFrame as number);
            clearFrame = requestAnimationFrame(restoreAfterClear);
        } else if (filterState.filter && isRestoring) {
            // A new filter before the next frame: the restore is not needed.
            cancelAnimationFrame(clearFrame as number);
            isRestoring = false;
        }
        update();
    });

    // Open and close requests from the keyboard navigation and the TalkBack listener.
    const onToggleRequest = (event: Event) => {
        if (event.target !== getTreeItem()) return;
        setOpen((event as CustomEvent<boolean>).detail);
    };
    element.addEventListener(TREE_ITEM_TOGGLE_EVENT, onToggleRequest);

    // `aria-busy` on the group while it holds skeletons and no sub-item.
    function syncGroupBusy() {
        const group = getGroup();
        if (!group) return;
        const children = Array.from(group.children);
        const isBusy =
            children.some((child) => child.classList.contains(SKELETON_CLASSNAME)) &&
            !children.some((child) => child.querySelector('[role="treeitem"]'));
        if (isBusy) group.setAttribute('aria-busy', 'true');
        else group.removeAttribute('aria-busy');
    }
    // Write the initial open state to the DOM at once: the keyboard navigation that opened the popup
    // runs before the next render (e.g. "the first visible selected item" on ArrowDown).
    if (state.isOpen) {
        getTreeItem()?.setAttribute('aria-expanded', 'true');
        getGroup()?.removeAttribute('hidden');
    }

    syncGroupBusy();
    const observer = new MutationObserver(syncGroupBusy);
    observer.observe(element, { childList: true, subtree: true });

    return {
        get state() {
            return state;
        },
        setOpen,
        toggle() {
            setOpen(!state.isOpen);
        },
        destroy() {
            cancelAnimationFrame(clearFrame as number);
            unregister();
            element.removeEventListener(TREE_ITEM_TOGGLE_EVENT, onToggleRequest);
            observer.disconnect();
        },
    };
}
