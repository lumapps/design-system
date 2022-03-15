import React, { forwardRef, useState } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';

import { SLIDESHOW_TRANSITION_DURATION } from '@lumx/core/js/constants';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemProps extends GenericProps {
    /** whether the slideshow item is currently visible */
    isCurrentlyVisible?: boolean;
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
    const { className, children, isCurrentlyVisible = false, ...forwardedProps } = props;
    const [isVisible, setIsVisible] = useState<boolean>(isCurrentlyVisible);

    useDelayedVisibility(isCurrentlyVisible, SLIDESHOW_TRANSITION_DURATION, (isNowVisible) => {
        setIsVisible(isNowVisible);
    });

    return (
        <div
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            aria-roledescription="slide"
            role="group"
            {...forwardedProps}
            style={!isVisible ? { visibility: 'hidden', ...(forwardedProps.style || {}) } : forwardedProps.style || {}}
            aria-hidden={!isVisible}
        >
            {children}
        </div>
    );
});

SlideshowItem.displayName = COMPONENT_NAME;
SlideshowItem.className = CLASSNAME;
