import { mdiChevronDown, mdiChevronRight } from '@lumx/icons';

import type { CommonRef, ElementType, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { IconButton, type IconButtonProps } from '../Button/IconButton';
import { ListItem } from '../List/ListItem';
import { ListItemAction, type ListItemActionProps } from '../List/ListItemAction';
import { RawClickable } from '../RawClickable';
import { CompositeItemDescription } from '../Composite/CompositeItemDescription';
import {
    TREE_LABEL_ATTRIBUTE,
    TREE_LEVEL_PROPERTY,
    TREE_MAIN_TOGGLE_VALUE,
    TREE_TOGGLE_ATTRIBUTE,
    getTreeListItemDescriptionId,
    getTreeListItemGroupId,
    getTreeListItemLabelId,
} from './dom';

/**
 * Injected framework-specific components for TreeListItem rendering.
 */
export interface TreeListItemComponents {
    /** Tooltip wrapper component (optional). Used when `tooltipProps` is provided. */
    Tooltip?: any;
}

/**
 * Defines the props for the core TreeListItem template.
 */
export interface TreeListItemProps extends HasClassName {
    /** Content of the row (the tree item label). */
    label?: JSXElement;
    /** The sub-items (`TreeListItem`, `ListboxOptionSkeleton` or `CompositeStatus` elements). */
    children?: JSXElement;
    /** A component to be rendered before the label (e.g. an icon or avatar). */
    before?: JSXElement;
    /** A component to be rendered after the label. */
    after?: JSXElement;
    /** Helper description (part of the filter match text). */
    description?: string;
    /** The value of the tree item. With a value, the tree item is selectable; without, it is not. */
    value?: string;
    /** Whether the tree item is selected (internal: from the tree `value`; no effect on a non-selectable tree item). */
    isSelected?: boolean;
    /** Props forwarded to a Tooltip wrapping the `role="treeitem"` element. */
    tooltipProps?: Record<string, any>;
    /** Extra props forwarded to the inner `role="treeitem"` element. */
    actionProps?: Record<string, any>;
    /** ref to the root `<li>` element. */
    ref?: CommonRef;
    /**
     * Unique ID for the tree item element (internal). The IDs of the label, the description and the group are
     * `<id>-label`, `<id>-description` and `<id>-group`.
     */
    id?: string;
    /** Whether the tree item is a parent item (internal: it has sub-items, or it loads them on open). */
    isParent?: boolean;
    /** Whether the parent item is open (internal). */
    isOpen?: boolean;
    /** Whether the filter hides the tree item (internal). */
    hidden?: boolean;
    /** Nesting level of the tree item (internal, 0 at the root). Its group sets the level of the sub-items. */
    level?: number;
    /** On click on the tree item (and on Enter). */
    handleClick?(): void;
    /** On click on the expand toggle. */
    handleToggleClick?(): void;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 */
export type TreeListItemPropsToOverride = 'label' | 'before' | 'after' | 'children' | 'tooltipProps' | 'actionProps';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TreeListItem';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-tree-list-item';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * TreeListItem core template: one tree item of a `TreeList`, with its sub-items in a group.
 *
 * - The `role="treeitem"` element is the row button. It holds the label and carries `aria-expanded`,
 *   `aria-selected` (only on a selectable tree item) and `aria-owns` (its group is a sibling, not a child).
 *   It is labelled by its label only (`aria-labelledby`), never by the text of the owned group.
 * - The expand toggle is a sibling of the row button, hidden from assistive technologies. On a
 *   non-selectable parent item, it is the main action of the row (its overlay covers the row).
 * - A closed group stays in the DOM, with `hidden`.
 * - Each group sets the level of its sub-items (`--lumx-tree-list-level`): the rows read it as a left
 *   padding, so the hover and selected backgrounds stay full width at every depth.
 * - The browser computes `aria-level`, `aria-setsize` and `aria-posinset` from the DOM.
 *
 * @param props Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const TreeListItem = (props: TreeListItemProps, { Tooltip }: TreeListItemComponents = {}) => {
    const {
        label,
        children,
        before,
        after,
        description,
        value,
        isSelected,
        tooltipProps,
        actionProps,
        ref,
        id,
        isParent,
        isOpen,
        hidden,
        level = 0,
        handleClick,
        handleToggleClick,
        className,
        ...forwardedProps
    } = props;
    const groupId = id && getTreeListItemGroupId(id);
    const labelId = id && getTreeListItemLabelId(id);
    const descriptionId = id && getTreeListItemDescriptionId(id);
    // The label and the description hold the own text of the tree item (the filter match text).
    const labelProps = { [TREE_LABEL_ATTRIBUTE]: '' };
    const groupStyle: Record<string, number> = { [TREE_LEVEL_PROPERTY]: level + 1 };
    const isSelectable = value !== undefined;
    // On a non-selectable parent item, the expand toggle is the main action of the row (action area
    // overlay: the whole row highlights on hover, and a click anywhere on it opens or closes the item).
    // The row action keeps `role="treeitem"` (the active item), but lets the pointer through: a plain `span` (no
    // click target, and no button styles to reset).
    const isToggleMainAction = Boolean(isParent) && !isSelectable;

    const rowActionProps: ListItemActionProps<ElementType> & Record<string, unknown> = {
        as: isToggleMainAction ? 'span' : 'button',
        ...actionProps,
        // Focus stays on the focus owner (the combobox trigger, or the standalone tree), never on the tree item.
        tabIndex: -1,
        id,
        role: 'treeitem',
        className: element('action', { passive: isToggleMainAction }),
        handleClick,
        'aria-owns': isParent ? groupId : undefined,
        'aria-expanded': isParent ? String(Boolean(isOpen)) : undefined,
        'aria-selected': isSelectable ? String(Boolean(isSelected)) : undefined,
        'data-value': value,
        // The name is the label only: without it, the name from content includes the owned group (sub-items).
        'aria-labelledby': labelId,
        'aria-describedby': description ? descriptionId : undefined,
        children: (
            <span id={labelId} {...labelProps}>
                {label}
            </span>
        ) as JSXElement,
    };
    const actionElement = isToggleMainAction ? RawClickable(rowActionProps) : ListItemAction(rowActionProps);

    const wrappedAction =
        Tooltip && tooltipProps && !hidden ? <Tooltip {...tooltipProps}>{actionElement}</Tooltip> : actionElement;

    const toggleProps: IconButtonProps & Record<string, unknown> = {
        className: element(
            'toggle',
            { main: isToggleMainAction },
            isToggleMainAction ? classNames.actionArea.action({ 'has-overlay': true, 'focus-inset': true }) : '',
        ),
        emphasis: 'low',
        size: 's',
        // Empty label: the toggle is hidden from assistive technologies (the tree item has `aria-expanded`).
        label: '',
        icon: isOpen ? mdiChevronDown : mdiChevronRight,
        tabIndex: -1,
        'aria-hidden': 'true',
        // `main`: the click target of the row (see `TREE_MAIN_TOGGLE_SELECTOR`).
        [TREE_TOGGLE_ATTRIBUTE]: isToggleMainAction ? TREE_MAIN_TOGGLE_VALUE : '',
        // Main action: the same as a click on the tree item (`onClick`, then open or close).
        handleClick: isToggleMainAction ? handleClick : handleToggleClick,
    };

    return (
        <li
            ref={ref}
            role="none"
            {...forwardedProps}
            hidden={hidden || undefined}
            className={classNames.join(className, block())}
        >
            {ListItem({
                // The row is a list item (size, padding, hover and selected styles), but not the `<li>`:
                // the `<li>` also holds the group, outside the row.
                as: 'div',
                size: 'tiny',
                className: element('row'),
                // The expand toggle (or a spacer on a leaf item) comes first, before the `before` content.
                before: (
                    <>
                        {isParent ? IconButton(toggleProps) : <span className={element('spacer')} />}
                        {before}
                    </>
                ) as JSXElement,
                after,
                children: (
                    <>
                        {wrappedAction}
                        {description &&
                            CompositeItemDescription({
                                id: descriptionId,
                                className: element('description'),
                                children: description,
                                ...labelProps,
                            })}
                    </>
                ) as JSXElement,
            })}
            {isParent && (
                <ul
                    role="group"
                    id={groupId}
                    className={element('group')}
                    // Level of the sub-items, read by the rows (and the other group children) as an indent.
                    style={groupStyle}
                    hidden={!isOpen || undefined}
                >
                    {children}
                </ul>
            )}
        </li>
    );
};

TreeListItem.displayName = COMPONENT_NAME;
TreeListItem.className = CLASSNAME;
