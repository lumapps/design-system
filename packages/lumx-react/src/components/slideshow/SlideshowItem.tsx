import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemProps extends GenericProps {
    /** interval in which slides are automatically shown */
    interval?: number;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SlideshowItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SlideshowItem: Comp<SlideshowItemProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, children, ...forwardedProps } = props;
    return (
        <div ref={ref} className={classNames(className, CLASSNAME)} {...forwardedProps}>
            {children}
        </div>
    );
});

SlideshowItem.displayName = COMPONENT_NAME;
SlideshowItem.className = CLASSNAME;
