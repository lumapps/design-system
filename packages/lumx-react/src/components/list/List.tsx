import { Size } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';

import { useKeyboardListNavigation, useKeyboardListNavigationType } from '@lumx/react/hooks/useKeyboardListNavigation';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

import classNames from 'classnames';
import React, { Key, ReactNode, Ref, useRef } from 'react';
import { useInteractiveList } from './useInteractiveList';

type ItemPaddingSizes = Size.big | Size.huge;

/**
 * Defines the props of the component.
 */
interface ListProps extends GenericProps {
    /** The children elements. Should be ListItem, ListSubheader or ListDivider. */
    children: ReactNode;
    /** The item padding size. */
    itemPadding?: ValueOf<ItemPaddingSizes>;
    /** The reference passed to the <ul> element. */
    listElementRef?: Ref<HTMLUListElement>;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The function called when a list item is selected. */
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

const List: React.FC<ListProps> & List = ({
    children,
    className,
    itemPadding,
    listElementRef,
    onListItemSelected,
    useCustomColors,
    ...forwardedProps
}) => {
    const ref = useRef<HTMLUListElement>(null);

    const { items, hasClickableItem } = useInteractiveList({
        items: children,
        ref,
        onListItemSelected,
    });
    const clickable = hasClickableItem;

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
