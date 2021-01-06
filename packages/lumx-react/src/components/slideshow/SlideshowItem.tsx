import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type SlideshowItemProps = GenericProps;

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
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
        >
            {children}
        </div>
    );
});
SlideshowItem.displayName = COMPONENT_NAME;
SlideshowItem.className = CLASSNAME;
