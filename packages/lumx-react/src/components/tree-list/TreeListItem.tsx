import { Children, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { GenericProps } from '@lumx/core/js/types';
import {
    TreeListItem as UI,
    TreeListItemProps as UIProps,
    TreeListItemPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/TreeList/TreeListItem';
import type { TreeListItemController, TreeListItemState } from '@lumx/core/js/components/TreeList/types';
import { optionActiveEvent } from '@lumx/core/js/components/Composite/constants';
import { isTreeListHandle } from '@lumx/core/js/components/TreeList/utils';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useId } from '@lumx/react/hooks/useId';
import { useIsomorphicLayoutEffect } from '@lumx/react/hooks/useIsomorphicLayoutEffect';
import { Tooltip, TooltipProps } from '../tooltip';
import { CompositeContext } from '../composite/CompositeContext';
import { TreeListContext } from './TreeListContext';
import { useCompositeEvent } from '../composite/useCompositeEvent';
import type { CompositeItemActionProps } from '../composite/types';

/** Props computed by the component (not public). */
type InternalProps =
    | 'id'
    | 'isParent'
    | 'isOpen'
    | 'isSelected'
    | 'hidden'
    | 'level'
    | 'handleClick'
    | 'handleToggleClick';

/**
 * Props for the TreeListItem component.
 */
export interface TreeListItemProps
    extends GenericProps,
        ReactToJSX<UIProps, TreeListItemPropsToOverride | InternalProps> {
    /** Content of the row (the tree item label). */
    label: ReactNode;
    /**
     * The sub-items: `TreeListItem`, `Combobox.OptionSkeleton` or `Combobox.State`.
     * A tree item with sub-items is a parent item.
     */
    children?: ReactNode;
    /**
     * Make a lazy parent item: a parent item with no sub-items until the user opens it (load the
     * sub-items in `onOpenChange`). Not needed when sub-items are present.
     * In a combobox, the open state resets on each popup open: cache the loaded sub-items.
     */
    hasSubItems?: boolean;
    /**
     * Called on every open and close by the user (expand toggle, Right, Left, Enter or a click on a
     * non-selectable parent item). Not called for the initial state or for the filter.
     */
    onOpenChange?(isOpen: boolean): void;
    /** On tree item clicked (or activated with Enter), selectable or not. */
    onClick?(): void;
    /** Content rendered before the label (e.g. an icon). */
    before?: ReactNode;
    /** Content rendered after the label. */
    after?: ReactNode;
    /** Props forwarded to a Tooltip wrapping the `role="treeitem"` element. */
    tooltipProps?: Partial<TooltipProps>;
    /** Props forwarded to the inner `role="treeitem"` element. */
    actionProps?: CompositeItemActionProps<any>;
}

/**
 * TreeListItem component: one tree item of a `TreeList`, with its sub-items.
 *
 * - With a `value`, the tree item is selectable (Enter or a click selects it), and it is selected when the
 *   tree `value` holds it. Without, it is not selectable: Enter or a click on a non-selectable parent item
 *   opens or closes it, and on a non-selectable leaf item only calls `onClick` (e.g. an action such as
 *   "Create a new list…").
 * - The open state is internal: a parent item starts open when a sub-item at any depth is selected.
 *   In a combobox, it resets on each popup open.
 * - Touch screen readers: TalkBack (Chrome) can open and close the parent items. On iOS, a user can
 *   only reach the sub-items of a selectable parent item through the filter. To support it, use a
 *   non-selectable parent item with an "All <name>" leaf item that carries the parent value.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const TreeListItem = forwardRef<TreeListItemProps, HTMLLIElement>((props, ref) => {
    const {
        label,
        children,
        value,
        hasSubItems,
        onOpenChange,
        onClick,
        before,
        after,
        tooltipProps,
        actionProps,
        ...forwardedProps
    } = props;
    const compositeContext = useContext(CompositeContext);
    if (!compositeContext) {
        throw new Error(`${COMPONENT_NAME} must be used within a TreeList`);
    }
    const { handle, level = 0 } = compositeContext;
    const tree = isTreeListHandle(handle) ? handle : null;
    // Inside another composite (e.g. a `Combobox.List`), the tree item is never registered: it stays inert.
    const isOutsideTree = !!handle && !tree;
    useEffect(() => {
        if (isOutsideTree) {
            console.warn(`[@lumx/react/${COMPONENT_NAME}] ${COMPONENT_NAME} must be used within a TreeList.`);
        }
    }, [isOutsideTree]);
    const id = useId();
    const internalRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const isParent = Boolean(hasSubItems) || Children.toArray(children).length > 0;
    const isSelectable = value !== undefined;
    // Selected when the tree `value` holds the tree item value.
    const treeContext = useContext(TreeListContext);
    const isSelected = isSelectable && !!treeContext?.isSelected(value);

    // Force the tooltip open while the tree item is the active item (keyboard highlight).
    const isActive = useCompositeEvent(tree, optionActiveEvent(id), false);

    // Latest props read by the controller.
    const latestProps = useRef({ isParent, onOpenChange });
    latestProps.current = { isParent, onOpenChange };

    const [state, setState] = useState<TreeListItemState>({ isOpen: false, hidden: false });
    const controllerRef = useRef<TreeListItemController | null>(null);
    // Layout effect: the initial open state (a selected sub-item) applies before the first paint.
    useIsomorphicLayoutEffect(() => {
        const element = internalRef.current;
        if (!element || !tree) return undefined;
        const controller = tree.registerTreeItem(element, {
            isParent: () => latestProps.current.isParent,
            onOpenChange: (isOpen) => latestProps.current.onOpenChange?.(isOpen),
            onChange: setState,
        });
        controllerRef.current = controller;
        setState(controller.state);
        return () => {
            controller.destroy();
            controllerRef.current = null;
        };
    }, [tree]);

    // The sub-items are one level deeper (a skeleton in a group does not make the tree busy).
    const nestedContext = useMemo(() => ({ ...compositeContext, level: level + 1 }), [compositeContext, level]);

    const handleClick = () => {
        onClick?.();
        // The tree list selects a selectable tree item. A non-selectable parent item opens or closes.
        if (!isSelectable) controllerRef.current?.toggle();
    };

    return UI(
        {
            ...forwardedProps,
            ref: mergedRef,
            id,
            label,
            value,
            isSelected,
            isParent,
            level,
            isOpen: state.isOpen,
            hidden: state.hidden,
            before,
            after,
            actionProps,
            handleClick,
            handleToggleClick: () => controllerRef.current?.toggle(),
            tooltipProps: tooltipProps && { ...tooltipProps, forceOpen: tooltipProps.forceOpen || isActive },
            // The core template renders the sub-items of a parent item only.
            children: <CompositeContext.Provider value={nestedContext}>{children}</CompositeContext.Provider>,
        },
        { Tooltip },
    );
});

TreeListItem.displayName = COMPONENT_NAME;
TreeListItem.className = CLASSNAME;
