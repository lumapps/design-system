import React, { useEffect } from 'react';
import { getFocusableElements } from '@lumx/react/utils/focus/getFocusableElements';

export interface UseSlideFocusManagementProps {
    isSlideDisplayed?: boolean;
    slidesRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Data attribute set on elements whose focus was blocked.
 * This is to easily find elements that have been tempered with,
 * and not elements whose focus was already initially blocked.
 */
const BLOCKED_FOCUS = 'data-focus-blocked';

/**
 * Manage how slides must behave when visible or not.
 * When not visible, they should be hidden from screen readers and not focusable.
 */
export const useSlideFocusManagement = ({ isSlideDisplayed, slidesRef }: UseSlideFocusManagementProps) => {
    const [slide, setSlide] = React.useState<HTMLDivElement | null>(null);

    const [focusableElementSet, setFocusableElementSet] = React.useState<Set<HTMLElement>>();
    React.useEffect(() => {
        if (!slide) {
            return undefined;
        }
        // Update the slide's focusable element list (including the blocked elements)
        const updateFocusableElements = () =>
            setFocusableElementSet((set = new Set()) => {
                // TODO: remove when `inert` gets sufficient browser support
                const focusedBlocked = Array.from(slide.querySelectorAll(`[${BLOCKED_FOCUS}]`)) as HTMLElement[];
                for (const element of focusedBlocked) {
                    set.add(element);
                }
                for (const element of getFocusableElements(slide)) {
                    set.add(element);
                }
                return set;
            });

        // Observe changes in the content of the slide
        const observer = new MutationObserver((mutationsList) => {
            if (mutationsList.some((mutation) => mutation.type === 'childList')) {
                updateFocusableElements();
            }
        });

        updateFocusableElements();

        observer.observe(slide, { attributes: true, childList: true, subtree: true });
        return observer.disconnect();
    }, [slide]);

    useEffect(() => {
        if (!slide || !focusableElementSet) {
            return;
        }
        const focusableElements = Array.from(focusableElementSet);

        if (!isSlideDisplayed) {
            /* Block slide */
            slide.setAttribute('inert', '');
            slide.setAttribute('aria-hidden', 'true');

            // TODO: remove when `inert` gets sufficient browser support
            for (const focusableElement of focusableElements) {
                focusableElement.setAttribute('tabindex', '-1');
                focusableElement.setAttribute(BLOCKED_FOCUS, '');
            }
        } else {
            /* Un-block slide */
            slide.removeAttribute('inert');
            slide.removeAttribute('aria-hidden');

            // TODO: remove when `inert` gets sufficient browser support
            for (const focusableElement of focusableElements) {
                focusableElement.removeAttribute('tabindex');
                focusableElement.removeAttribute(BLOCKED_FOCUS);
            }

            // Change focus on slide displayed
            const isUserActivated = slidesRef?.current?.dataset.lumxUserActivated === 'true';
            if (isUserActivated) {
                let elementToFocus: HTMLElement | undefined = slide;

                // We have exactly one focusable element => focus it
                if (focusableElementSet.size === 1) {
                    // eslint-disable-next-line prefer-destructuring
                    elementToFocus = focusableElements[0];
                }

                // We have not focusable element => focus the pagination item
                if (focusableElementSet.size === 0) {
                    elementToFocus = document.querySelector(`[aria-controls="${slide?.id}"]`) as HTMLElement;
                }

                elementToFocus?.focus({ preventScroll: true });
            }
        }
    }, [focusableElementSet, isSlideDisplayed, slide, slidesRef]);

    return setSlide;
};
