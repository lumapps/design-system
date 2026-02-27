import { ElementType, ReactNode, SyntheticEvent } from 'react';

import { ComponentRef, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ListItemAction as UI,
    ListItemActionProps as UIProps,
} from '@lumx/core/js/components/List/ListItemAction';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { GenericProps } from '@lumx/core/js/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * ListItem.Action props.
 */
export type ListItemActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> &
    GenericProps &
    ReactToJSX<UIProps, 'children'> &
    HasRequiredLinkHref<E> & {
        /** Content of the action (label). */
        children: ReactNode;
        /** On click callback. */
        onClick?(evt: SyntheticEvent): void;
    };

/**
 * ListItem.Action sub-component.
 *
 * Renders a button or link with action area classes.
 * When placed as a child of ListItem, it activates the action area pattern:
 * the entire list item becomes visually clickable, while other interactive
 * elements (in `before`/`after` slots) remain independently clickable.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListItemAction = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'button'>(props: ListItemActionProps<E>, ref: ComponentRef<E>) => {
        const { children, onClick, ...forwardedProps } = props;
        return UI({ ...forwardedProps, handleClick: onClick, ref, children });
    }),
    { displayName: COMPONENT_NAME, className: CLASSNAME, defaultProps: DEFAULT_PROPS },
);
