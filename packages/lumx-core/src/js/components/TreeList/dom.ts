import { SELECTED_SELECTOR } from '../Composite/utils';
import { CLASSNAME as SKELETON_CLASSNAME } from '../Listbox/ListboxOptionSkeleton';

/** Whether an element is an item skeleton (`Combobox.OptionSkeleton`). */
const isSkeletonElement = (el: Element) => el.classList.contains(SKELETON_CLASSNAME);

/*
 * The DOM contract of the tree: the markup that the `TreeList` and `TreeListItem` templates render. The tree
 * list handle (with its tree item registry) and the tree navigation read the tree through this module only.
 *
 * <ul role="tree">
 *   <li role="none">                                        ← tree item root (registered on the tree list)
 *     <div>                                                 ← row
 *       <button data-tree-toggle="main" | "">               ← expand toggle (parent item only)
 *       <button role="treeitem" id="<id>"                   ← tree item element (the active item)
 *               aria-owns="<id>-group" aria-expanded>        (aria-owns and aria-expanded: parent item only)
 *         <span id="<id>-label" data-tree-label>            ← label (filter match text)
 *       </button>
 *       <p data-tree-label>                                 ← description (filter match text)
 *     </div>
 *     <ul role="group" id="<id>-group" hidden?>             ← group (parent item only): sub-item roots,
 *     </ul>                                                   skeletons and state
 *   </li>
 * </ul>
 */

/** The tree item elements. */
const TREE_ITEM_ROLE_SELECTOR = '[role="treeitem"]';

/** The groups of sub-items. */
const GROUP_SELECTOR = '[role="group"]';

/**
 * Tree items that can become active: not inside a hidden ancestor (a closed group, or a tree item
 * hidden by the filter). The selector tree walker does not skip hidden subtrees, so the selector does.
 */
export const TREE_ITEM_SELECTOR = `${TREE_ITEM_ROLE_SELECTOR}:not([hidden] *)`;

/** Attribute of the elements that hold the own text of a tree item (its label and description). */
export const TREE_LABEL_ATTRIBUTE = 'data-tree-label';

/** Attribute of the expand toggles: `TREE_MAIN_TOGGLE_VALUE` when the toggle is the main action of the row, else empty. */
export const TREE_TOGGLE_ATTRIBUTE = 'data-tree-toggle';

/** Value of `TREE_TOGGLE_ATTRIBUTE` on the expand toggle that is the main action of the row. */
export const TREE_MAIN_TOGGLE_VALUE = 'main';

/** The expand toggles (their mousedown must not move DOM focus). */
export const TREE_TOGGLE_SELECTOR = `[${TREE_TOGGLE_ATTRIBUTE}]`;

/**
 * The expand toggle of a non-selectable parent item: the main action of the row (its overlay covers the row
 * and catches the clicks on the tree item).
 */
export const TREE_MAIN_TOGGLE_SELECTOR = `[${TREE_TOGGLE_ATTRIBUTE}="${TREE_MAIN_TOGGLE_VALUE}"]`;

/** Get the ID of the group of sub-items of a tree item. */
export const getTreeListItemGroupId = (id: string) => `${id}-group`;

/** Get the ID of the label of a tree item. */
export const getTreeListItemLabelId = (id: string) => `${id}-label`;

/** Get the ID of the description of a tree item. */
export const getTreeListItemDescriptionId = (id: string) => `${id}-description`;

/** CSS custom property set on each group: the nesting level of its sub-items (the indent). */
export const TREE_LEVEL_PROPERTY = '--lumx-tree-list-level';

/** The root of the tree item that contains an element (a tree item element, an expand toggle, a group…). */
export const getTreeItemRoot = (target: Element) => target.closest<HTMLElement>('li');

/** The tree item element of a tree item root (the row comes before the group: it is the first one). */
export const getTreeItemOfRoot = (root: HTMLElement) => root.querySelector<HTMLElement>(TREE_ITEM_ROLE_SELECTOR);

/** The group of a tree item root (null on a leaf item). */
export const getGroupOfRoot = (root: HTMLElement) => root.querySelector<HTMLElement>(`:scope > ${GROUP_SELECTOR}`);

/** The root of the parent item of a tree item root (null for a root tree item). */
export function getParentRoot(root: HTMLElement): HTMLElement | null {
    const group = root.parentElement?.closest(GROUP_SELECTOR);
    return group ? getTreeItemRoot(group) : null;
}

/** Find the parent item of a tree item element, inside the tree element. Returns null for a root tree item. */
export function getParentTreeItem(container: HTMLElement, item: HTMLElement): HTMLElement | null {
    const root = getTreeItemRoot(item);
    const parentRoot = root && getParentRoot(root);
    return parentRoot && container.contains(parentRoot) ? getTreeItemOfRoot(parentRoot) : null;
}

/** The first sub-item of a tree item element that can become active (null on a leaf item or a closed group). */
export function getFirstSubItem(item: HTMLElement): HTMLElement | null {
    const root = getTreeItemRoot(item);
    const group = root && getGroupOfRoot(root);
    return group?.querySelector<HTMLElement>(TREE_ITEM_SELECTOR) ?? null;
}

/**
 * The open state of a tree item element in the DOM: undefined on a leaf item (no `aria-expanded`). (The tree
 * item registry holds the open state: this is the fallback for a tree item that is not registered.)
 */
export function isTreeItemOpen(item: HTMLElement): boolean | undefined {
    const expanded = item.getAttribute('aria-expanded');
    return expanded === null ? undefined : expanded === 'true';
}

/**
 * Write the open state of a parent item to the DOM, before the framework renders it: Up/Down select the tree
 * items that can become active from the DOM (not in a `hidden` group), and they can run before the next render.
 */
export function writeTreeItemOpen(root: HTMLElement, isOpen: boolean) {
    getTreeItemOfRoot(root)?.setAttribute('aria-expanded', String(isOpen));
    getGroupOfRoot(root)?.toggleAttribute('hidden', !isOpen);
}

/**
 * The own text of a tree item root: its label and description, never the text of its sub-items. Only the row is
 * read (the children of the root other than the group), so the cost does not depend on the number of sub-items.
 */
export function getTreeItemText(root: HTMLElement): string {
    return Array.from(
        root.querySelectorAll(`:scope > :not(${GROUP_SELECTOR}) [${TREE_LABEL_ATTRIBUTE}]`),
        (label) => label.textContent ?? '',
    ).join(' ');
}

/** Whether a sub-item at any depth of a tree item root is selected. */
export const hasSelectedSubItem = (root: HTMLElement) =>
    Boolean(getGroupOfRoot(root)?.querySelector(SELECTED_SELECTOR));

/** Whether a group holds skeletons (`Combobox.OptionSkeleton`) and no sub-item: its sub-items are loading. */
function isGroupLoading(group: HTMLElement): boolean {
    const children = Array.from(group.children);
    return children.some(isSkeletonElement) && !children.some((child) => child.querySelector(TREE_ITEM_ROLE_SELECTOR));
}

/**
 * Keep `aria-busy` on the group of a tree item root while the group holds skeletons and no sub-item.
 * Observes the direct children only: the root (the group appears or goes) and the group (the skeletons and the
 * sub-item roots, inserted with their content). Returns the function that stops the observation.
 */
export function observeGroupBusy(root: HTMLElement): () => void {
    let group: HTMLElement | null = null;
    let groupObserver: MutationObserver | undefined;
    function syncGroupBusy() {
        const currentGroup = getGroupOfRoot(root);
        if (currentGroup !== group) {
            groupObserver?.disconnect();
            group = currentGroup;
            if (group) groupObserver?.observe(group, { childList: true });
        }
        if (!group) return;
        if (isGroupLoading(group)) group.setAttribute('aria-busy', 'true');
        else group.removeAttribute('aria-busy');
    }
    groupObserver = new MutationObserver(syncGroupBusy);
    syncGroupBusy();
    const rootObserver = new MutationObserver(syncGroupBusy);
    rootObserver.observe(root, { childList: true });
    return () => {
        rootObserver.disconnect();
        groupObserver?.disconnect();
    };
}
