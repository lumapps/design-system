import { Children } from 'react';

import {
    InlineList as UI,
    type InlineListProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/InlineList';
import { GenericProps } from '@lumx/react/utils/type';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface InlineListProps extends GenericProps, ReactToJSX<UIProps, 'items'> {
    /**
     * Children
     */
    children?: React.ReactNode;
}

/**
 * InlineList component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InlineList = forwardRef<InlineListProps, HTMLUListElement>((props, ref) => {
    const { children, ...rest } = props;
    return UI({ ...rest, ref, items: Children.toArray(children) as any });
});

InlineList.displayName = COMPONENT_NAME;
InlineList.className = CLASSNAME;
InlineList.defaultProps = DEFAULT_PROPS;
