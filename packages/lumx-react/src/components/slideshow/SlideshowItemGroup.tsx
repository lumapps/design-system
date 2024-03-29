import React, { forwardRef } from 'react';

import classNames from 'classnames';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

import { Comp, GenericProps } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useSlideFocusManagement } from './useSlideFocusManagement';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemGroupProps extends GenericProps {
    role?: 'tabpanel' | 'group';
    label?: string;
    isDisplayed?: boolean;
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
    const { className, children, role = 'group', label, isDisplayed, ...forwardedProps } = props;
    const groupRef = React.useRef<HTMLDivElement>(null);

    useSlideFocusManagement({ isSlideDisplayed: isDisplayed, slideRef: groupRef });

    return (
        <div
            ref={mergeRefs(groupRef, ref)}
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
