import React, { useEffect } from 'react';
import { INTERACTIVE_ELEMENTS_STRING } from '@lumx/core/js/constants';

import { CLASSNAME as ITEM_CLASSNAME } from './SlideshowItem';

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

        const startIndexVisible = activeIndex * groupBy;
        const endIndexVisible = startIndexVisible + groupBy;

        const slideshowChildren = element?.getElementsByClassName(ITEM_CLASSNAME);

        /**
         * Classname set on elements whose focus was blocked.
         * This is to easily find elements that have been tempered with,
         * and not elements whose focus was already initially blocked.
         * */
        const elementWithBlockedFocusClass = `${ITEM_CLASSNAME}__no-focus`;

        /**
         * Display given slide to screen readers and, if focus was blocked, restore focus on elements..
         */
        const enableSlide = (slide: Element) => {
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
        const blockSlide = (slide: Element) => {
            slide.setAttribute('aria-hidden', 'true');
            slide.querySelectorAll(INTERACTIVE_ELEMENTS_STRING).forEach((focusableElement) => {
                // If the element already has blocked focus, we leave it as is as we would remove it when slide becomes visible.
                if (!focusableElement.hasAttribute('tabindex') || focusableElement.getAttribute('tabindex') !== '-1') {
                    focusableElement.setAttribute('tabindex', '-1');
                    focusableElement.classList.add(elementWithBlockedFocusClass);
                }
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
