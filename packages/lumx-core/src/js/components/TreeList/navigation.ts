import { createListFocusNavigation } from '../../utils/focusNavigation';
import type { CompositeNavigation, CompositeNavigationOptions } from '../Composite/types';

/**
 * Event dispatched on a tree item element to ask its component to open (`detail: true`) or close it.
 * Internal contract between the tree list handle and the tree item components (React and Vue).
 */
export const TREE_ITEM_TOGGLE_EVENT = 'lumx-tree-item-toggle';

/** Ask the component of a tree item element to open or close it (see {@link TREE_ITEM_TOGGLE_EVENT}). */
export function requestTreeItemOpen(item: HTMLElement, isOpen: boolean) {
    item.dispatchEvent(new CustomEvent(TREE_ITEM_TOGGLE_EVENT, { detail: isOpen, bubbles: true }));
}

/**
 * Tree items that can become active: not inside a hidden ancestor (a closed group, or a tree item
 * hidden by the filter). The selector tree walker does not skip hidden subtrees, so the selector does.
 */
export const TREE_ITEM_SELECTOR = '[role="treeitem"]:not([hidden] *)';

/** The expand toggles (their mousedown must not move DOM focus). */
export const TREE_TOGGLE_SELECTOR = '[data-tree-toggle]';

/**
 * The expand toggle of a non-selectable parent item: the main action of the row (its overlay covers the row
 * and catches the clicks on the tree item).
 */
export const TREE_MAIN_TOGGLE_SELECTOR = '[data-tree-toggle="main"]';

/**
 * Find the parent item of a tree item: the tree item that owns (`aria-owns`) its closest group.
 * Returns null for a root tree item.
 */
export function getParentTreeItem(container: HTMLElement, item: HTMLElement): HTMLElement | null {
    const group = item.closest<HTMLElement>('[role="group"]');
    if (!group?.id || !container.contains(group)) return null;
    return container.querySelector<HTMLElement>(`[role="treeitem"][aria-owns="${CSS.escape(group.id)}"]`);
}

/**
 * Navigation module for the tree pattern (`role="tree"` with `role="treeitem"` items, sub-items in `role="group"`).
 * Up/Down move over the visible tree items (the ones inside a closed parent item are skipped).
 * Right/Left open and close the parent items, or move to the first sub-item and to the parent item.
 */
export function createTreeNavigation(options: CompositeNavigationOptions): CompositeNavigation<'tree'> {
    const { container, callbacks, signal, getActiveItem, wrap } = options;
    const focusNav = createListFocusNavigation(
        { type: 'list', container, itemSelector: TREE_ITEM_SELECTOR, wrap, getActiveItem },
        callbacks,
        signal,
    );
    return {
        type: 'tree',
        focusNav,
        cellSelector: TREE_ITEM_SELECTOR,
        keepFocusSelector: TREE_TOGGLE_SELECTOR,
        // A tree item without a value is not selectable: only its own click handler runs.
        isOptionCell: (cell) => cell.hasAttribute('data-value'),
        // A click on the main expand toggle is a click on the row: its cell is the tree item of the row
        // (the first tree item in its `<li>`, the sub-items come after it).
        getCellFromTarget(target) {
            const cell = target.closest<HTMLElement>(TREE_ITEM_SELECTOR);
            if (cell) return cell;
            const mainToggle = target.closest(TREE_MAIN_TOGGLE_SELECTOR);
            return mainToggle?.closest('li')?.querySelector<HTMLElement>(TREE_ITEM_SELECTOR) ?? null;
        },
        scrollIntoView(item) {
            item.scrollIntoView({ block: 'nearest' });
        },
        // Right: open the active parent item, or move to its first visible sub-item.
        // Left: close the active parent item, or move to its parent item.
        // Not handled without an active item (the input trigger moves the text caret).
        navigateHorizontal(key) {
            const item = focusNav.selectors.activeItem;
            if (!item) return false;
            const expanded = item.getAttribute('aria-expanded');
            if (key === 'ArrowRight') {
                if (expanded === 'false') {
                    requestTreeItemOpen(item, true);
                } else if (expanded === 'true') {
                    const groupId = item.getAttribute('aria-owns');
                    const group = groupId ? container.querySelector(`#${CSS.escape(groupId)}`) : null;
                    const firstSubItem = group?.querySelector<HTMLElement>(TREE_ITEM_SELECTOR);
                    if (firstSubItem) focusNav.goTo(() => firstSubItem);
                }
                return true;
            }
            if (expanded === 'true') {
                requestTreeItemOpen(item, false);
                return true;
            }
            const parent = getParentTreeItem(container, item);
            if (parent) focusNav.goTo(() => parent);
            return true;
        },
    };
}
