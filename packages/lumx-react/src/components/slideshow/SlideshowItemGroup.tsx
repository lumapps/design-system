import React from 'react';

import classNames from 'classnames';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useSlideFocusManagement } from './useSlideFocusManagement';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemGroupProps extends GenericProps {
    role?: 'tabpanel' | 'group';
    label?: string;
    isDisplayed?: boolean;
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowItemGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-slideshow-item-group';

export const buildSlideShowGroupId = (slidesId: string, index: number) => `${slidesId}-slide-${index}`;

/**
 * SlideshowItemGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SlideshowItemGroup = forwardRef<SlideshowItemGroupProps, HTMLDivElement>((props, ref) => {
    const { className, children, role = 'group', label, isDisplayed, ...forwardedProps } = props;
    const groupRef = React.useRef<HTMLDivElement>(null);

    useSlideFocusManagement({ isSlideDisplayed: isDisplayed, slideRef: groupRef });

    return (
        <div
            ref={mergeRefs(groupRef, ref)}
            role={role}
            className={classNames(className, CLASSNAME)}
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
