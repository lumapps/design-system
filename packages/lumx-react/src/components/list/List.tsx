import { Size } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';

import { useKeyboardListNavigation, useKeyboardListNavigationType } from '@lumx/react/hooks/useKeyboardListNavigation';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

import classNames from 'classnames';
import React, { Key, ReactNode, Ref, useRef } from 'react';
import { useInteractiveList } from './useInteractiveList';

/**
 * Defines the props of the component.
 */
interface ListProps extends GenericProps {
    /** List content (should use `<ListItem>`, `<ListSubheader>` or `<ListDivider>`) */
    children: ReactNode;

    /**
     * Whether the list items are clickable.
     * @deprecated not needed anymore.
     */
    isClickable?: boolean;

    /** Item padding size. */
    itemPadding?: Size.big | Size.huge;

    /** The ref passed to the ul element. */
    listElementRef?: Ref<HTMLUListElement>;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /**
     * Callback used to retrieved the select entry.
     *
     * @param key   React key of the selected item.
     * @param index Index of the selected item among the sibling items.
     */
    onListItemSelected?(key: Key, index: number): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}List`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

interface List {
    useKeyboardListNavigation: useKeyboardListNavigationType;
}

/**
 * List component - Use vertical layout to display elements
 *
 * @param  props The component props.
 * @return The component.
 */
const List: React.FC<ListProps> & List = (props) => {
    const {
        className,
        isClickable,
        itemPadding = Size.big,
        listElementRef,
        onListItemSelected,
        useCustomColors,
        children,
        ...forwardedProps
    } = props;
    const ref = useRef<HTMLUListElement>(null);

    const { items, hasClickableItem } = useInteractiveList({
        items: children,
        ref,
        onListItemSelected,
    });
    const clickable = hasClickableItem || isClickable;

    return (
        <ul
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    itemPadding: itemPadding ?? (clickable ? Size.big : undefined),
                }),
                useCustomColors && `${CSS_PREFIX}-custom-colors`,
            )}
            tabIndex={clickable ? 0 : -1}
            ref={mergeRefs(listElementRef, ref)}
        >
            {items}
        </ul>
    );
};

List.displayName = COMPONENT_NAME;
List.useKeyboardListNavigation = useKeyboardListNavigation;

export { CLASSNAME, List, ListProps };
