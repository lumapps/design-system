import { ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    TreeList as UI,
    TreeListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/TreeList/TreeList';
import { setupTreeList } from '@lumx/core/js/components/TreeList/setupTreeList';
import type { TreeListHandle } from '@lumx/core/js/components/TreeList/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useId } from '@lumx/react/hooks/useId';
import { CompositeContext, CompositeContextValue } from '../composite/CompositeContext';
import { useCompositeList } from '../composite/useCompositeList';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';

/**
 * Props of the TreeList component.
 */
export interface TreeListProps extends ReactToJSX<UIProps, 'aria-busy' | 'children'> {
    /** The tree items (`TreeListItem`), and `Combobox.OptionSkeleton` or `Combobox.State`. */
    children?: ReactNode;
    /**
     * Called when a selectable tree item is selected (Enter, Space or a click), in a standalone tree only.
     * In a combobox, the trigger `onSelect` (`Combobox.Input` or `Combobox.Button`) handles the selection.
     */
    onSelect?(option: { value: string }): void;
}

/**
 * TreeList component: a list in the WAI-ARIA tree pattern (`role="tree"`), with `TreeListItem` items.
 * Use `Combobox.OptionSkeleton`, `Combobox.State`, `Combobox.SelectionIcon` and `Combobox.OptionMoreInfo`
 * inside, as in a list.
 *
 * Adapts to its parent:
 * - Inside a combobox (`Combobox.Provider`): the tree is the combobox list. The trigger owns focus, the
 *   popup opens and closes, and the tree items render only while it is open. The `id` prop is ignored
 *   (the tree takes the combobox list ID, used by the trigger `aria-controls`).
 * - Otherwise, a standalone tree: the tree is its own focus owner (a single tab stop, `aria-activedescendant`
 *   on the tree), handles its own keyboard, and is always open. It has no filter. `onSelect` is called on
 *   a selection.
 *
 * The parent is the nearest one: a tree rendered inside a list, an option or a tree item of a combobox
 * (e.g. in a `Combobox.OptionMoreInfo` popover) is standalone. A tree rendered directly under a
 * `Combobox.Provider` is the combobox list, even through a portal (e.g. in a dialog opened from the
 * combobox): render a standalone tree outside of the `Combobox.Provider`. The mode is set on the first render.
 *
 * Keyboard and filter:
 * - Up/Down move over the visible tree items, Right/Left open and close the parent items (or move to
 *   the first sub-item and to the parent item). Enter (or a click) selects a selectable tree item.
 * - With `filter="auto"` on `Combobox.Input`, a tree item matches on its own label and description. The
 *   matching items, their ancestors (opened) and the descendants of a matching parent item stay visible.
 * - With `filter="manual"`, the consumer renders the result: while the input text is not empty, every
 *   parent item with rendered sub-items opens (a matching parent item with no matching sub-item opens
 *   too, unlike `"auto"`). For a tree with lazy parent items, prefer `"manual"` with a search on the server.
 * - Option count (`Combobox.State`): the matching items during an auto filter, every rendered tree item
 *   during a manual filter, and no count without a filter.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const TreeList = forwardRef<TreeListProps, HTMLUListElement>((props, ref) => {
    const { className, children, onSelect, id: propId, ...forwardedProps } = props;
    const compositeContext = useContext(CompositeContext);
    const comboboxContext = useOptionalComboboxContext();
    // The combobox is the parent only when the nearest composite context is the one of `Combobox.Provider`
    // (same ID, no level). A list, a tree item or a standalone listbox in between makes the tree standalone.
    const isInCombobox =
        !!comboboxContext && compositeContext?.id === comboboxContext.listboxId && compositeContext.level === undefined;
    const generatedId = useId();
    // In a combobox, the trigger controls the tree with the combobox list ID (`aria-controls`).
    const id = isInCombobox ? comboboxContext.listboxId : propId ?? generatedId;

    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;

    // Standalone: the tree owns focus (no focus owner link). The handle does not need the DOM element.
    const [standaloneTree] = useState(() =>
        isInCombobox ? null : setupTreeList({ onSelect: (option) => onSelectRef.current?.(option) }),
    );
    // Tear down the handle (pending timers, subscribers) on unmount.
    useEffect(() => () => standaloneTree?.destroy(), [standaloneTree]);

    const internalRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);

    // Inside a combobox: create the tree list handle (linked to the trigger) and register it on the combobox.
    const {
        handle: tree,
        isOpen,
        isLoading,
    } = useCompositeList<TreeListHandle>({
        elementRef: internalRef,
        combobox: isInCombobox ? { handle: comboboxContext.handle, createList: setupTreeList } : undefined,
        standaloneHandle: standaloneTree,
    });

    const selectionType = String(forwardedProps['aria-multiselectable']) === 'true' ? 'multiple' : 'single';
    const contextValue = useMemo<CompositeContextValue>(
        () => ({ handle: tree, id, type: 'tree', selectionType, level: 0 }),
        [tree, id, selectionType],
    );

    return (
        <CompositeContext.Provider value={contextValue}>
            {UI({
                ...forwardedProps,
                // Standalone: the tree itself is the (single) tab stop.
                ...(tree?.isStandalone ? { tabIndex: 0 } : {}),
                'aria-busy': isLoading || undefined,
                className,
                ref: mergedRef,
                id,
                children: isOpen ? children : null,
            })}
        </CompositeContext.Provider>
    );
});
TreeList.displayName = COMPONENT_NAME;
TreeList.className = CLASSNAME;
