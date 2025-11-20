import { Key, ReactNode, SyntheticEvent, useRef } from 'react';

import classNames from 'classnames';

import { Size } from '@lumx/react';
import { useKeyboardListNavigation } from '@lumx/react/hooks/useKeyboardListNavigation';
import { GenericProps } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useInteractiveList } from './useInteractiveList';

/**
 * Defines the props of the component.
 */
export interface ListProps extends GenericProps {
    /** List content (should be ListItem, ListSubheader or ListDivider). */
    children: ReactNode;
    /**
     * Whether the list items are clickable.
     * @deprecated not needed anymore.
     */
    isClickable?: boolean;
    /** Item padding size. */
    itemPadding?: Extract<Size, 'big' | 'huge'>;
    /** Tab index of the list. Default to -1 */
    tabIndex?: number;
    /**
     * On list item selected callback.
     *
     * @param key   React key of the selected item.
     * @param index Index of the selected item among the sibling items.
     * @param evt   Source event (either mouse or keyboard event).
     */
    onListItemSelected?(key: Key, index: number, evt: SyntheticEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'List';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ListProps> = {
    tabIndex: -1,
};

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/**
 * List component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalList = forwardRef<ListProps, HTMLUListElement>((props, ref) => {
    const {
        children,
        className,
        isClickable,
        itemPadding,
        onListItemSelected,
        tabIndex = DEFAULT_PROPS.tabIndex,
        ...forwardedProps
    } = props;
    const listElementRef = useRef<HTMLUListElement>(null);

    const { items, hasClickableItem } = useInteractiveList({
        items: children,
        ref: listElementRef,
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
            )}
            tabIndex={tabIndex}
            ref={mergeRefs(ref, listElementRef)}
        >
            {items}
        </ul>
    );
});
InternalList.displayName = COMPONENT_NAME;
InternalList.className = CLASSNAME;
InternalList.defaultProps = DEFAULT_PROPS;

export const List = Object.assign(InternalList, { useKeyboardListNavigation });
