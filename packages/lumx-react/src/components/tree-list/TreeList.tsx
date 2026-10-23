import { ReactNode, useCallback, useMemo, useRef } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    TreeList as UI,
    TreeListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/TreeList/TreeList';
import { setupTreeList } from '@lumx/core/js/components/TreeList/setupTreeList';
import { isTreeValueSelected, toggleTreeValue } from '@lumx/core/js/components/TreeList/selection';
import type { TreeListHandle } from '@lumx/core/js/components/TreeList/types';
import type { CompositeOptions } from '@lumx/core/js/components/Composite/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useId } from '@lumx/react/hooks/useId';
import { CompositeContext, CompositeContextValue } from '../composite/CompositeContext';
import { useCompositeList } from '../composite/useCompositeList';
import { TreeListContext, TreeListContextValue } from './TreeListContext';

/** Props common to the single and multiple selection trees. */
interface BaseTreeListProps extends ReactToJSX<UIProps, 'aria-busy' | 'children' | 'selectionType'> {
    /** The tree items (`TreeListItem`), and `Combobox.OptionSkeleton` or `Combobox.State`. */
    children?: ReactNode;
    /**
     * Called when a selectable tree item is selected (Enter, Space or a click), in a standalone tree only.
     * In a combobox, the trigger `onSelect` (`Combobox.Input` or `Combobox.Button`) handles the selection.
     */
    onSelect?(option: { value: string }): void;
}

/** Single selection tree props (`selectionType` defaults to `'single'`). */
export interface SingleTreeListProps extends BaseTreeListProps {
    /** Selection type. Optional: defaults to `'single'`. */
    selectionType?: 'single';
    /** The value of the selected tree item (or `undefined` when nothing is selected). */
    value?: string;
    /** Called with the value of the selected tree item when the selection changes. */
    onChange?(newValue: string): void;
}

/** Multiple selection tree props (`selectionType: 'multiple'` is required to opt in). */
export interface MultipleTreeListProps extends BaseTreeListProps {
    /** Selection type. */
    selectionType: 'multiple';
    /** The values of the selected tree items. */
    value?: string[];
    /** Called with the values of the selected tree items when the selection changes (the selected item is toggled). */
    onChange?(newValue: string[]): void;
}

/**
 * Props of the TreeList component. Discriminated on `selectionType`: with `'multiple'`, `value` and `onChange`
 * take arrays.
 */
export type TreeListProps = SingleTreeListProps | MultipleTreeListProps;

/**
 * TreeList component: a list in the WAI-ARIA tree pattern (`role="tree"`), with `TreeListItem` (`TreeList.Item`) items.
 * Use `Combobox.OptionSkeleton` and `Combobox.State` inside, as in a list.
 *
 * Selection: `value` holds the selected tree item value (or values with `selectionType="multiple"`), and
 * the tree items read their selected state from it. `onChange` receives the new value on every selection
 * (in a combobox too): the selected value, or the toggled values with `selectionType="multiple"`.
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
    const {
        className,
        children,
        onSelect,
        onChange: _onChange,
        value,
        selectionType = DEFAULT_PROPS.selectionType,
        id: propId,
        ...forwardedProps
    } = props;
    const internalRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);

    // Latest props read by the selection handler (the handle is created once).
    const latestProps = useRef(props);
    latestProps.current = props;

    /** Compute the next value from the selected tree item, and call `onChange`. */
    const handleSelect = useCallback((option: { value: string }) => {
        const { current } = latestProps;
        if (current.selectionType === 'multiple') current.onChange?.(toggleTreeValue(current.value, option.value));
        else current.onChange?.(option.value);
    }, []);

    /** Create the tree list handle (with the combobox list options, or as a standalone tree), with the selection. */
    const createList = useCallback(
        (options: CompositeOptions) =>
            setupTreeList({
                ...options,
                onSelect(option, element) {
                    options.onSelect?.(option, element);
                    handleSelect(option);
                },
            }),
        [handleSelect],
    );

    // The combobox list (linked to the trigger), or a standalone tree that owns focus.
    const {
        handle: tree,
        comboboxListId,
        isOpen,
        isLoading,
    } = useCompositeList<TreeListHandle>({ elementRef: internalRef, createList, onSelect });
    const generatedId = useId();
    // In a combobox, the trigger controls the tree with the combobox list ID (`aria-controls`).
    const id = comboboxListId ?? propId ?? generatedId;

    const contextValue = useMemo<CompositeContextValue>(
        () => ({ handle: tree, id, type: 'tree', selectionType, level: 0 }),
        [tree, id, selectionType],
    );
    // The selection, read by the tree items.
    const treeContextValue = useMemo<TreeListContextValue>(
        () => ({ isSelected: (itemValue) => isTreeValueSelected(value, itemValue) }),
        [value],
    );

    return (
        <CompositeContext.Provider value={contextValue}>
            <TreeListContext.Provider value={treeContextValue}>
                {UI({
                    ...forwardedProps,
                    // Standalone: the tree itself is the (single) tab stop.
                    ...(tree?.isStandalone ? { tabIndex: 0 } : {}),
                    'aria-busy': isLoading,
                    className,
                    ref: mergedRef,
                    id,
                    selectionType,
                    children: isOpen ? children : null,
                })}
            </TreeListContext.Provider>
        </CompositeContext.Provider>
    );
});
TreeList.displayName = COMPONENT_NAME;
TreeList.className = CLASSNAME;
