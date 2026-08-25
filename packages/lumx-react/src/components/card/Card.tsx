import { ElementType, ReactNode } from 'react';

import {
    Card as UI,
    CardProps as UIProps,
    type DefaultCardTag,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Card';
import { ComponentRef, GenericProps, HasPolymorphicAs } from '@lumx/react/utils/type';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export type CardProps<E extends ElementType = DefaultCardTag> = GenericProps &
    ReactToJSX<UIProps, 'as'> &
    HasPolymorphicAs<E> & {
        /** Card content. */
        children?: ReactNode;
    };

/**
 * Card component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Card = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = DefaultCardTag>(props: CardProps<E>, ref: ComponentRef<E>) => {
        return UI({ ...props, ref });
    }),
    {
        displayName: COMPONENT_NAME,
        className: CLASSNAME,
        defaultProps: DEFAULT_PROPS,
    },
);
