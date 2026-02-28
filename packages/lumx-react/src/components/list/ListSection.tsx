import { ReactNode } from 'react';

import { Text } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ListSection as UI,
    ListSectionProps as UIProps,
} from '@lumx/core/js/components/List/ListSection';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useId } from '@lumx/react/hooks/useId';

/**
 * Defines the props of the component.
 */
export interface ListSectionProps extends GenericProps, ReactToJSX<UIProps, 'children' | 'id' | 'Text'> {
    /** Section content */
    children: ReactNode;
}

/**
 * ListSection component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListSection = forwardRef<ListSectionProps, HTMLLIElement>((props, ref) => {
    const id = useId();
    return UI({ ...props, ref, id, Text });
});

ListSection.displayName = COMPONENT_NAME;
ListSection.className = CLASSNAME;
ListSection.defaultProps = DEFAULT_PROPS;
