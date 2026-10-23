import { createListFocusNavigation } from '../../utils/focusNavigation';
import type { CompositeNavigation, CompositeNavigationOptions } from '../Composite/types';
import {
    TREE_ITEM_SELECTOR,
    TREE_MAIN_TOGGLE_SELECTOR,
    TREE_TOGGLE_SELECTOR,
    getFirstSubItem,
    getParentTreeItem,
    getTreeItemOfRoot,
    getTreeItemRoot,
} from './dom';

/** What the tree navigation reads and requests through the tree item registry. */
export interface TreeNavigationRegistry {
    /** The open state of a tree item element (undefined on a leaf item). */
    getOpenState(item: HTMLElement): boolean | undefined;
    /** Open or close the parent item of a tree item element. */
    openTreeItem(item: HTMLElement, isOpen: boolean): void;
}

/**
 * Navigation module for the tree pattern (`role="tree"` with `role="treeitem"` items, sub-items in `role="group"`).
 * Up/Down move over the visible tree items (the ones inside a closed parent item are skipped).
 * Right/Left open and close the parent items (through the tree item registry, which holds the open state), or
 * move to the first sub-item and to the parent item.
 */
export function createTreeNavigation(
    options: CompositeNavigationOptions,
    { getOpenState, openTreeItem }: TreeNavigationRegistry,
): CompositeNavigation {
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
            const root = mainToggle && getTreeItemRoot(mainToggle);
            return root ? getTreeItemOfRoot(root) : null;
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
            const isOpen = getOpenState(item);
            if (key === 'ArrowRight') {
                if (isOpen === false) {
                    openTreeItem(item, true);
                } else if (isOpen) {
                    const firstSubItem = getFirstSubItem(item);
                    if (firstSubItem) focusNav.goTo(() => firstSubItem);
                }
                return true;
            }
            if (isOpen) {
                openTreeItem(item, false);
                return true;
            }
            const parent = getParentTreeItem(container, item);
            if (parent) focusNav.goTo(() => parent);
            return true;
        },
    };
}
