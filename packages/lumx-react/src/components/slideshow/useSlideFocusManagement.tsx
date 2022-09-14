import React, { useEffect } from 'react';
import { getFocusableElements } from '@lumx/react/utils/focus/getFocusableElements';

import { CLASSNAME as ITEM_GROUP_CLASSNAME } from './SlideshowItemGroup';

export interface UseSlideFocusManagementProps {
    activeIndex: number;
    groupBy?: number;
    wrapperRef: React.RefObject<HTMLDivElement>;
}

/**
 * Manage how slides must behave when visible or not.
 * When not visible, they should be hidden from screen readers and not focusable.
 */
export const useSlideFocusManagement = ({ activeIndex, groupBy = 1, wrapperRef }: UseSlideFocusManagementProps) => {
    useEffect(() => {
        const element = wrapperRef?.current;
        const startIndexVisible = activeIndex;
        const endIndexVisible = startIndexVisible + 1;

        const slideshowChildren = element?.querySelectorAll<HTMLElement>(`.${ITEM_GROUP_CLASSNAME}`);

        /**
         * Classname set on elements whose focus was blocked.
         * This is to easily find elements that have been tempered with,
         * and not elements whose focus was already initially blocked.
         * */
        const elementWithBlockedFocusClass = `${ITEM_GROUP_CLASSNAME}__no-focus`;

        /**
         * Display given slide to screen readers and, if focus was blocked, restore focus on elements..
         */
        const enableSlide = (slide: HTMLElement) => {
            // Hide from screen readers
            slide.setAttribute('aria-hidden', 'false');
            // Find elements we have blocked focus on
            slide.querySelectorAll(`.${elementWithBlockedFocusClass}`).forEach((focusableElement) => {
                focusableElement.removeAttribute('tabindex');
                focusableElement.classList.remove(elementWithBlockedFocusClass);
            });
        };

        /**
         * Hide given slide from screen readers and block focus on all focusable elements within.
         */
        const blockSlide = (slide: HTMLElement) => {
            slide.setAttribute('aria-hidden', 'true');
            getFocusableElements(slide).forEach((focusableElement) => {
                focusableElement.setAttribute('tabindex', '-1');
                focusableElement.classList.add(elementWithBlockedFocusClass);
            });
        };

        if (slideshowChildren && slideshowChildren?.length > 0) {
            Array.from(slideshowChildren).forEach((slide, slideIndex) => {
                const slideIsVisible = slideIndex >= startIndexVisible && slideIndex < endIndexVisible;

                if (slideIsVisible) {
                    enableSlide(slide);
                } else {
                    blockSlide(slide);
                }
            });
        }
    }, [activeIndex, groupBy, wrapperRef]);
};
