import { includesIgnoreCase } from '../../utils/string/includesIgnoreCase';
import { setupComposite } from '../Composite/setupComposite';
import type { CompositeFilter } from '../Composite/types';
import { createTreeNavigation } from './navigation';
import {
    getGroupOfRoot,
    getParentRoot,
    getTreeItemOfRoot,
    getTreeItemRoot,
    getTreeItemText,
    hasSelectedSubItem,
    isTreeItemOpen,
    observeGroupBusy,
    writeTreeItemOpen,
} from './dom';
import type {
    TreeListHandle,
    TreeListItemController,
    TreeListItemOptions,
    TreeListItemState,
    TreeListOptions,
} from './types';

/** Filter state of a tree item (computed by the tree item registry). */
interface TreeItemFilterState {
    /** The current filter text (empty string: no filter). */
    filter: string;
    /** Hidden by the auto filter: it does not match, and no tree item above or below it matches. */
    hidden: boolean;
    /**
     * A tree item below this one matches (auto filter), or it has rendered sub-items (manual filter: the consumer
     * renders the result).
     */
    hasMatchBelow: boolean;
}

/** The filter state of every tree item without a filter. */
const NO_FILTER_STATE: TreeItemFilterState = { filter: '', hidden: false, hasMatchBelow: false };

/** A registered tree item, as the registry sees it (its controller is given to the tree item component). */
interface TreeItemEntry {
    /** The open state of the parent item (undefined on a leaf item). */
    readonly isOpen: boolean | undefined;
    /** Apply the filter state computed by the registry (no-op when unchanged). */
    applyFilterState(state: TreeItemFilterState): void;
    /** After a filter clear (one frame later): back to the open state before the filter. */
    restoreAfterClear(): void;
    /** Open or close the parent item (a user action). */
    setOpen(isOpen: boolean): void;
}

/**
 * Set up tree list behavior (WAI-ARIA tree pattern) independent of any DOM element.
 *
 * Built on the composite base (see {@link setupComposite}: focus owner, focus navigation, keyboard,
 * selection, open state, skeletons, loading announcement and events). The tree list adds the tree item
 * registry (the open state and the filter state of each tree item, see
 * {@link TreeListHandle.registerTreeItem}), the tree filter and the tree navigation (Right and Left open
 * and close the parent items through the registry).
 *
 * - Standalone (no `focusOwner` option): the tree element owns DOM focus and `aria-activedescendant`,
 *   and handles its own keyboard navigation. It has no filter.
 * - Linked (`focusOwner` option, e.g. a combobox trigger): the parent owns focus and the keyboard; the
 *   tree writes `aria-activedescendant` on the parent focus owner. The trigger input sets the filter.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
export function setupTreeList(options: TreeListOptions = {}): TreeListHandle {
    /** Tree items, keyed by their root `<li>` element. */
    const registrations = new Map<HTMLElement, TreeItemEntry>();
    /** Number of matching tree items (auto filter only), from the last full update. */
    let matchingCount = 0;
    /** The filter of the last full update (to detect a clear). */
    let lastFilter = '';
    /** The frame of the restore after a filter clear (see {@link TreeItemEntry.restoreAfterClear}). */
    let restoreFrame: number | undefined;

    /** Whether the auto filter is active (a filter text in `'auto'` mode; `'manual'`: no tree item is hidden). */
    const isAutoFiltering = ({ value, mode }: CompositeFilter) => mode === 'auto' && value.length > 0;

    function cancelRestore() {
        if (restoreFrame === undefined) return;
        cancelAnimationFrame(restoreFrame);
        restoreFrame = undefined;
    }

    /**
     * Number of result items (the item count and the empty state of the live region): the matching items during
     * an auto filter, else every registered tree item (also the ones in a closed group).
     */
    const getVisibleCount = (filter: CompositeFilter) => (isAutoFiltering(filter) ? matchingCount : registrations.size);

    /** The closest registered tree item that contains this one (null for a root tree item). */
    function getParentRegistration(item: HTMLElement): HTMLElement | null {
        let parent = getParentRoot(item);
        while (parent && !registrations.has(parent)) parent = getParentRoot(parent);
        return parent;
    }

    /**
     * Compute the filter state of every tree item (from the DOM nesting and the filter) and notify the
     * changed ones. Auto filter: a tree item is visible when it is a matching item, when a tree item below
     * it matches, or when a tree item above it matches. Manual filter: nothing is hidden, and every parent
     * item with rendered sub-items has a "match below" (the consumer renders the result).
     * Linear in the number of tree items (each ancestor chain is walked once).
     */
    function updateTreeItems(filter: CompositeFilter) {
        const { value: filterValue } = filter;
        const isCleared = Boolean(lastFilter) && !filterValue;
        lastFilter = filterValue;
        // A new filter before the restore frame: the restore is not needed.
        if (filterValue) cancelRestore();
        matchingCount = 0;
        if (registrations.size === 0) return;
        const items = Array.from(registrations.keys());
        const parents = new Map(items.map((item) => [item, getParentRegistration(item)]));
        /** The registered parent items of a tree item, from its parent item up to the root. */
        function* ancestorsOf(item: HTMLElement) {
            for (let parent = parents.get(item); parent; parent = parents.get(parent)) yield parent;
        }
        const isAuto = isAutoFiltering(filter);
        const matching = new Set<HTMLElement>();
        const hasMatchBelow = new Set<HTMLElement>();
        if (filterValue) {
            for (const item of items) {
                if (!isAuto) {
                    const parent = parents.get(item);
                    if (parent) hasMatchBelow.add(parent);
                } else if (includesIgnoreCase(getTreeItemText(item), filterValue)) {
                    matching.add(item);
                    // Stop at the first marked ancestor: the ones above it are marked too.
                    for (const parent of ancestorsOf(item)) {
                        if (hasMatchBelow.has(parent)) break;
                        hasMatchBelow.add(parent);
                    }
                }
            }
        }
        matchingCount = matching.size;
        /** Whether a tree item above this one matches (memoized per parent item). */
        const matchAbove = new Map<HTMLElement, boolean>();
        const hasMatchAbove = (item: HTMLElement): boolean => {
            const parent = parents.get(item);
            if (!parent) return false;
            let value = matchAbove.get(parent);
            if (value === undefined) {
                value = matching.has(parent) || hasMatchAbove(parent);
                matchAbove.set(parent, value);
            }
            return value;
        };
        for (const item of items) {
            registrations.get(item)?.applyFilterState({
                filter: filterValue,
                hidden: isAuto && !matching.has(item) && !hasMatchBelow.has(item) && !hasMatchAbove(item),
                hasMatchBelow: hasMatchBelow.has(item),
            });
        }
        // A selection clears the filter before the framework renders the new `aria-selected`: the open state
        // after the clear (which keeps the ancestors of the selected items open) is only known on the next frame.
        if (isCleared) {
            cancelRestore();
            restoreFrame = requestAnimationFrame(() => {
                restoreFrame = undefined;
                for (const entry of registrations.values()) entry.restoreAfterClear();
            });
        }
    }

    /** The open state of a tree item element, from the registry (from the DOM for an unregistered tree item). */
    function getOpenState(item: HTMLElement): boolean | undefined {
        const root = getTreeItemRoot(item);
        const entry = root && registrations.get(root);
        return entry ? entry.isOpen : isTreeItemOpen(item);
    }

    /** Open or close the registered parent item of a tree item element (the keyboard navigation requests). */
    function openTreeItem(item: HTMLElement, isOpen: boolean) {
        const root = getTreeItemRoot(item);
        if (root) registrations.get(root)?.setOpen(isOpen);
    }

    const {
        handle: composite,
        notifyOptionsChange,
        getFilter,
    } = setupComposite(options, {
        createNavigation: (navigationOptions) =>
            createTreeNavigation(navigationOptions, { getOpenState, openTreeItem }),

        getVisibleCount,

        // A tree shows no item count without a filter.
        isCountHidden: (filter) => !filter.value,

        applyFilter: updateTreeItems,

        onMount(element, signal) {
            if (!options.focusOwner) return;
            // In a combobox, the TalkBack "Expand" and "Collapse" actions (Chrome Android) send an
            // ArrowRight or ArrowLeft keydown to the tree item element itself, not to the focus owner.
            // Open or close that tree item. Select nothing and do not move the active item.
            element.addEventListener(
                'keydown',
                (event) => {
                    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
                    if (!item || getOpenState(item) === undefined) return;
                    event.preventDefault();
                    openTreeItem(item, event.key === 'ArrowRight');
                },
                { signal },
            );
        },

        destroy() {
            cancelRestore();
            lastFilter = '';
            matchingCount = 0;
            registrations.clear();
        },
    });

    /**
     * Without a filter, the state of a tree item does not depend on the other tree items: skip the full update
     * (it walks the DOM for every tree item), so that mounting n tree items stays O(n). With a filter, each
     * registration is one full update (linear): the new tree item gets its state at once.
     */
    function updateIfFiltered() {
        const filter = getFilter();
        if (filter.value) updateTreeItems(filter);
    }

    /** Register a tree item root and create the controller of its open state (see {@link TreeListHandle}). */
    function registerTreeItem(element: HTMLElement, itemOptions: TreeListItemOptions): TreeListItemController {
        const { isParent, onOpenChange, onChange } = itemOptions;
        // Look inside the element (not in the document): Vue sets up the item before it is attached.
        const getTreeItem = () => getTreeItemOfRoot(element);
        const getGroup = () => getGroupOfRoot(element);
        const hasSelectedBelow = () => hasSelectedSubItem(element);

        let filterState = NO_FILTER_STATE;
        /** Open state set by the user (or the initial state) without a filter. */
        let userOpen = hasSelectedBelow();
        /** Open state set by the user during a filter (lasts until the next change of the filter text). */
        let filterOverride: boolean | null = null;
        /**
         * True from a filter clear to the next frame (the registry restore frame): the open state does not change
         * meanwhile (see `updateTreeItems`).
         */
        let isRestoring = false;
        let state: TreeListItemState = { isOpen: false, hidden: false };

        function computeState(): TreeListItemState {
            const { filter, hasMatchBelow, hidden } = filterState;
            if (isRestoring) return { isOpen: state.isOpen, hidden };
            let isOpen = false;
            if (isParent()) {
                if (!filter) isOpen = userOpen;
                else if (filterOverride !== null) isOpen = filterOverride;
                else isOpen = hasMatchBelow;
            }
            return { isOpen, hidden };
        }

        state = computeState();

        /** Move an active item inside the (closed) group to this tree item. */
        function moveActiveItemOutOfGroup() {
            const { activeItem } = composite;
            const treeItem = getTreeItem();
            if (treeItem && activeItem && getGroup()?.contains(activeItem)) composite.setActiveItem(treeItem);
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
            if (filter) filterOverride = isOpen;
            else userOpen = isOpen;
            // A user action ends the restore after a filter clear at once (it takes effect now, not on the frame).
            isRestoring = false;
            update();
            onOpenChange?.(isOpen);
        }

        /** After a filter clear: back to the state before the filter, but the ancestors of the selected items stay open. */
        function restoreAfterClear() {
            if (!isRestoring) return;
            isRestoring = false;
            if (hasSelectedBelow()) userOpen = true;
            update();
        }

        function applyFilterState(next: TreeItemFilterState) {
            const last = filterState;
            if (
                last.filter === next.filter &&
                last.hidden === next.hidden &&
                last.hasMatchBelow === next.hasMatchBelow
            ) {
                return;
            }
            // A user action during a filter lasts until the next change of the filter text (also a clear).
            if (last.filter !== next.filter) filterOverride = null;
            filterState = next;
            // A clear: wait for the registry restore frame. A new filter before it: the restore is not needed.
            if (last.filter && !next.filter) isRestoring = true;
            else if (next.filter) isRestoring = false;
            update();
        }

        registrations.set(element, {
            get isOpen() {
                return isParent() ? state.isOpen : undefined;
            },
            applyFilterState,
            restoreAfterClear,
            setOpen,
        });
        updateIfFiltered();
        notifyOptionsChange();

        // Write the initial open state to the DOM at once: the keyboard navigation that opened the popup
        // runs before the next render (e.g. "the first visible selected item" on ArrowDown).
        if (state.isOpen) writeTreeItemOpen(element, true);

        const stopGroupBusy = observeGroupBusy(element);

        return {
            get state() {
                return state;
            },
            setOpen,
            toggle() {
                setOpen(!state.isOpen);
            },
            destroy() {
                stopGroupBusy();
                registrations.delete(element);
                updateIfFiltered();
                notifyOptionsChange();
            },
        };
    }

    // Add the tree item registry to the composite handle (keeps its getters).
    return Object.assign(composite, { registerTreeItem });
}
