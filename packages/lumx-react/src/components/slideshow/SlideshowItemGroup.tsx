import React from 'react';

import { getRootClassName } from '@lumx/react/utils/className';

import { useSlideFocusManagement } from './useSlideFocusManagement';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemGroupProps {
    id?: string;
    label?: string;
    isDisplayed?: boolean;
    slidesRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowItemGroup';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

export const buildSlideShowGroupId = (slidesId: string | undefined, index: number) =>
    slidesId && `${slidesId}-slide-${index}`;

/**
 * Internal slideshow item group component.
 */
export const SlideshowItemGroup: React.FC<SlideshowItemGroupProps> = (props) => {
    const { id, children, label, isDisplayed, slidesRef } = props;

    const groupRef = useSlideFocusManagement({
        isSlideDisplayed: isDisplayed,
        slidesRef,
    });

    return (
        <div id={id} ref={groupRef} role="group" className={CLASSNAME} aria-label={label} tabIndex={-1}>
            {children}
        </div>
    );
};
SlideshowItemGroup.displayName = COMPONENT_NAME;
