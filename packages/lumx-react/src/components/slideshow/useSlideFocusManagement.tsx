import { useEffect } from 'react';
import { getFocusableElements } from '@lumx/react/utils/browser/focus/getFocusableElements';

export interface UseSlideFocusManagementProps {
    isSlideDisplayed?: boolean;
    slideRef: React.RefObject<HTMLDivElement>;
}

/**
 * Classname set on elements whose focus was blocked.
 * This is to easily find elements that have been tempered with,
 * and not elements whose focus was already initially blocked.
 * */
const BLOCKED_FOCUS_CLASSNAME = 'focus-blocked';

/**
 * Manage how slides must behave when visible or not.
 * When not visible, they should be hidden from screen readers and not focusable.
 */
export const useSlideFocusManagement = ({ isSlideDisplayed, slideRef }: UseSlideFocusManagementProps) => {
    useEffect(() => {
        const element = slideRef?.current;

        if (!element) {
            return undefined;
        }

        /**
         * Display given slide to screen readers and, if focus was blocked, restore focus on elements.
         */
        const enableSlide = () => {
            // Hide from screen readers
            element.setAttribute('aria-hidden', 'false');
            // Find elements we have blocked focus on
            element.querySelectorAll(`.${BLOCKED_FOCUS_CLASSNAME}`).forEach((focusableElement) => {
                focusableElement.removeAttribute('tabindex');
                focusableElement.classList.remove(BLOCKED_FOCUS_CLASSNAME);
            });
        };

        /**
         * Hide given slide from screen readers and block focus on all focusable elements within.
         */
        const blockSlide = () => {
            element.setAttribute('aria-hidden', 'true');
            getFocusableElements(element).forEach((focusableElement) => {
                focusableElement.setAttribute('tabindex', '-1');
                focusableElement.classList.add(BLOCKED_FOCUS_CLASSNAME);
            });
        };

        const handleDisplay = () => {
            if (!element) {
                return;
            }
            if (isSlideDisplayed) {
                enableSlide();
            } else {
                blockSlide();
            }
        };

        // Callback function to execute when mutations are observed
        const callback: MutationCallback = (mutationsList) => {
            if (element) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        handleDisplay();
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        if (element) {
            handleDisplay();

            /** If slide is hidden, start observing for elements to block focus  */
            if (!isSlideDisplayed) {
                observer.observe(element, { attributes: true, childList: true, subtree: true });
            }
        }

        return () => {
            if (!isSlideDisplayed) {
                observer.disconnect();
            }
        };
    }, [isSlideDisplayed, slideRef]);
};
