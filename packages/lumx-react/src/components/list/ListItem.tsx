import { ReactNode, Ref, SyntheticEvent } from 'react';

import { GenericProps, HasAriaDisabled } from '@lumx/react/utils/type';
import {
    ListItem as UI,
    ListItemProps as UIProps,
    ListItemPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/List/ListItem';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { ListItemAction } from './ListItemAction';

export type { ListItemSize } from '@lumx/core/js/components/List/ListItem';

/**
 * Defines the props of the component.
 */
export interface ListItemProps extends GenericProps, HasAriaDisabled, ReactToJSX<UIProps, ListItemPropsToOverride> {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** Content. */
    children: string | ReactNode;
    /** Reference to the <li> element. */
    listItemRef?: Ref<HTMLLIElement>;
    /** Reference to the link element. */
    linkRef?: Ref<HTMLAnchorElement>;
    /** On click callback. */
    onClick?(event: SyntheticEvent): void;
    /** @alias onClick */
    onItemSelected?(evt: SyntheticEvent): void;
}

/**
 * ListItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const _ListItem = forwardRef<ListItemProps, HTMLLIElement>((props, ref) => {
    const { disabledStateProps, otherProps } = useDisableStateProps(props);
    const { onItemSelected, onClick, linkRef, ...forwardedProps } = otherProps;

    const handleClick = (event: any) => {
        onItemSelected?.(event);
        onClick?.(event);
    };

    return UI({
        ...forwardedProps,
        isDisabled: disabledStateProps.disabled,
        'aria-disabled': disabledStateProps['aria-disabled'],
        ref,
        linkRef,
        handleClick: onItemSelected || onClick ? handleClick : undefined,
    });
});
_ListItem.displayName = COMPONENT_NAME;
_ListItem.className = CLASSNAME;
_ListItem.defaultProps = DEFAULT_PROPS;

/**
 * ListItem component with Action sub-component.
 */
export const ListItem = Object.assign(_ListItem, {
    /** Sub-component that renders the default action (button or link) for the action area pattern. */
    Action: ListItemAction,
});
