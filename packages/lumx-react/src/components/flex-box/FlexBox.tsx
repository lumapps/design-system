import React from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    getFlexBoxProps,
    FlexBoxProps as CoreFlexBoxProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/FlexBox';
import { GenericProps } from '@lumx/core/js/types';

export type {
    MarginAutoAlignment,
    GapSize,
    FlexVerticalAlignment,
    FlexHorizontalAlignment,
} from '@lumx/core/js/components/FlexBox';

/**
 * Defines the props of the component.
 */
export interface FlexBoxProps extends CoreFlexBoxProps, GenericProps {
    /** Customize the root element. */
    as?: React.ElementType;
}

/**
 * FlexBox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const FlexBox = forwardRef<FlexBoxProps, HTMLDivElement>((props, ref) => {
    const { as: Component = 'div', children, ...forwardedProps } = props;

    return (
        <Component ref={ref} {...getFlexBoxProps(forwardedProps)}>
            {children}
        </Component>
    );
});
FlexBox.displayName = COMPONENT_NAME;
FlexBox.className = CLASSNAME;
