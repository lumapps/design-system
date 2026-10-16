import { setupComposite } from '../Composite/setupComposite';
import type { CompositeFilterMode } from '../Composite/types';
import { createTreeNavigation, requestTreeItemOpen } from './navigation';
import type { TreeItemFilterState, TreeItemRegistration, TreeListHandle, TreeListOptions } from './types';

/** The own text of a tree item: its label and description, never the text of its sub-items. */
function getTreeItemText(item: HTMLElement): string {
    return Array.from(item.querySelectorAll('[data-tree-label]'))
        .filter((label) => label.closest('li') === item)
        .map((label) => label.textContent ?? '')
        .join(' ')
        .toLowerCase();
}

/**
 * Set up tree list behavior (WAI-ARIA tree pattern) independent of any DOM element.
 *
 * Built on the composite base (see {@link setupComposite}: focus owner, focus navigation, keyboard,
 * selection, open state, skeletons, loading announcement and events). The tree list adds the tree item
 * registry, the tree filter and the tree navigation (Right and Left open and close the parent items).
 *
 * - Standalone (no `focusOwner` option): the tree element owns DOM focus and `aria-activedescendant`,
 *   and handles its own keyboard navigation. It has no filter.
 * - Linked (`focusOwner` option, e.g. a combobox trigger): the parent owns focus and the keyboard; the
 *   tree writes `aria-activedescendant` on the parent focus owner. The trigger input sets the filter.
 *
 * The open state of each parent item belongs to its tree item component (see `setupTreeListItem`): the
 * navigation asks for an open or a close with a DOM event on the tree item (`TREE_ITEM_TOGGLE_EVENT`).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
export function setupTreeList(options: TreeListOptions = {}): TreeListHandle {
    const isStandalone = !options.focusOwner;
    /** Current filter value (empty string = no filtering). */
    let filterValue = '';
    /** Current filter mode (`'manual'`: the consumer renders the result, no tree item is hidden). */
    let filterMode: CompositeFilterMode = 'auto';
    /** Tree items, keyed by their root `<li>` element. */
    const registrations = new Map<HTMLElement, TreeItemRegistration>();

    /** Whether the auto filter is active (a filter text in `'auto'` mode). */
    const isAutoFiltering = () => filterMode === 'auto' && filterValue.length > 0;

    /** Number of visible tree items: the matching items during an auto filter, else every tree item. */
    function getVisibleCount(): number {
        if (!isAutoFiltering()) return registrations.size;
        let count = 0;
        for (const reg of registrations.values()) {
            if (reg.last?.matching) count += 1;
        }
        return count;
    }

    /** Set the filter state of a tree item, and notify it when the state changed. */
    function applyTreeItemState(item: HTMLElement, state: TreeItemFilterState) {
        const reg = registrations.get(item);
        if (!reg) return;
        const { last } = reg;
        if (
            last &&
            last.filter === state.filter &&
            last.hidden === state.hidden &&
            last.matching === state.matching &&
            last.hasMatchBelow === state.hasMatchBelow
        ) {
            return;
        }
        reg.last = state;
        reg.callback(state);
    }

    /** The closest registered tree item that contains this one (null for a root tree item). */
    function getParentRegistration(item: HTMLElement): HTMLElement | null {
        let parent = item.parentElement?.closest('li');
        while (parent && !registrations.has(parent)) parent = parent.parentElement?.closest('li');
        return parent ?? null;
    }

    /**
     * Compute the filter state of every tree item (from the DOM nesting and the filter) and notify the
     * changed ones. Auto filter: a tree item is visible when it is a matching item, when a tree item below
     * it matches, or when a tree item above it matches. Manual filter: nothing is hidden, and every parent
     * item with rendered sub-items has a "match below" (the consumer renders the result).
     */
    function updateTreeItems() {
        if (registrations.size === 0) return;
        const items = Array.from(registrations.keys());
        const parents = new Map(items.map((item) => [item, getParentRegistration(item)]));
        const isAuto = isAutoFiltering();
        const filterLower = filterValue.toLowerCase();
        const matching = new Set<HTMLElement>();
        const hasMatchBelow = new Set<HTMLElement>();
        if (filterValue) {
            for (const item of items) {
                if (!isAuto) {
                    const parent = parents.get(item);
                    if (parent) hasMatchBelow.add(parent);
                } else if (getTreeItemText(item).includes(filterLower)) {
                    matching.add(item);
                    for (let parent = parents.get(item); parent; parent = parents.get(parent) ?? null) {
                        hasMatchBelow.add(parent);
                    }
                }
            }
        }
        const hasMatchAbove = (item: HTMLElement) => {
            for (let parent = parents.get(item); parent; parent = parents.get(parent) ?? null) {
                if (matching.has(parent)) return true;
            }
            return false;
        };
        for (const item of items) {
            const isMatching = matching.has(item);
            applyTreeItemState(item, {
                filter: filterValue,
                hidden: isAuto && !isMatching && !hasMatchBelow.has(item) && !hasMatchAbove(item),
                matching: isMatching,
                hasMatchBelow: hasMatchBelow.has(item),
            });
        }
    }

    const { handle: composite, notifyOptionsChange } = setupComposite<'tree'>(options, {
        createNavigation: (_element, navigationOptions) => createTreeNavigation(navigationOptions),

        getVisibleCount,

        // A tree shows no item count without a filter.
        isCountHidden: () => !filterValue,

        setFilter(newFilter, mode) {
            filterValue = newFilter;
            filterMode = mode;
            updateTreeItems();
        },

        onMount(element, _navigation, signal) {
            if (isStandalone) return;
            // In a combobox, the TalkBack "Expand" and "Collapse" actions (Chrome Android) send an
            // ArrowRight or ArrowLeft keydown to the tree item element itself, not to the focus owner.
            // Open or close that tree item. Select nothing and do not move the active item.
            element.addEventListener(
                'keydown',
                (event) => {
                    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
                    if (!item?.hasAttribute('aria-expanded')) return;
                    event.preventDefault();
                    requestTreeItemOpen(item, event.key === 'ArrowRight');
                },
                { signal },
            );
        },

        destroy() {
            filterValue = '';
            filterMode = 'auto';
            registrations.clear();
        },
    });

    // Add the tree item registry to the composite handle (keeps its getters).
    return Object.assign(composite, {
        registerTreeItem(element: HTMLElement, callback: (state: TreeItemFilterState) => void) {
            registrations.set(element, { callback, last: null });
            // Without a filter, the state of a tree item does not depend on the other tree items: skip the
            // full update (it walks the DOM for every tree item), so that mounting n tree items stays O(n).
            if (filterValue) updateTreeItems();
            else applyTreeItemState(element, { filter: '', hidden: false, matching: false, hasMatchBelow: false });
            notifyOptionsChange();
            return () => {
                registrations.delete(element);
                if (filterValue) updateTreeItems();
                notifyOptionsChange();
            };
        },
    });
}
