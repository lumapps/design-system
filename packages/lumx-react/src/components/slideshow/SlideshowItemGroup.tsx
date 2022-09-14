import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemGroupProps extends GenericProps {
    role?: 'tabpanel' | 'group';
    label?: string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowItemGroup';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

export const buildSlideShowGroupId = (slidesId: string, index: number) => `${slidesId}-slide-${index}`;

/**
 * SlideshowItemGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SlideshowItemGroup: Comp<SlideshowItemGroupProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, children, role = 'group', label, ...forwardedProps } = props;
    return (
        <div
            ref={ref}
            role={role}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            aria-roledescription="slide"
            aria-label={label}
            {...forwardedProps}
        >
            {children}
        </div>
    );
});

SlideshowItemGroup.displayName = COMPONENT_NAME;
SlideshowItemGroup.className = CLASSNAME;
