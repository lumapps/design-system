import { Key, SyntheticEvent } from 'react';

import { Size } from '@lumx/react';
import { useKeyboardListNavigation } from '@lumx/react/hooks/useKeyboardListNavigation';
import { GenericProps } from '@lumx/react/utils/type';
import {
    List as UI,
    ListProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/List';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface ListProps extends GenericProps, ReactToJSX<UIProps> {
    /**
     * Whether the list items are clickable.
     * @deprecated not needed anymore.
     */
    isClickable?: boolean;
    /** Tab index of the list. */
    tabIndex?: number;
    /** @deprecated not supported since v4.0.0 */
    onListItemSelected?(key: Key, index: number, evt: SyntheticEvent): void;
}

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/**
 * List component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalList = forwardRef<ListProps, HTMLUListElement>((props, ref) => {
    const { children, isClickable, onListItemSelected, itemPadding, ...forwardedProps } = props;
    const adjustedItemPadding = itemPadding ?? (isClickable ? Size.big : undefined);

    return UI({ ...forwardedProps, ref, children, itemPadding: adjustedItemPadding });
});
InternalList.displayName = COMPONENT_NAME;
InternalList.className = CLASSNAME;
InternalList.defaultProps = DEFAULT_PROPS;

export const List = Object.assign(InternalList, { useKeyboardListNavigation });
