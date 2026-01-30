import React from 'react';
import { isReducedMotion } from '@lumx/react/utils/browser/isReducedMotion';
import { onScrollEnd } from '../../utils/browser/onScrollEnd';

interface UseSlideScrollParams {
    /** Weather to enable or not */
    enabled?: boolean;
    /** The active index of the slide */
    activeIndex: number;
    /** The ref to the wrapper element */
    wrapperRef: React.RefObject<HTMLDivElement>;
    /** Callback when the active index changes */
    onChange?: (index: number) => void;
}

/**
 * Hook to handle scroll synchronization for the Slideshow component.
 * It syncs the scroll position with the active index and vice versa.
 */
export const useSlideScroll = ({ enabled, activeIndex, wrapperRef, onChange }: UseSlideScrollParams) => {
    const isAutoScrollRef = React.useRef(false);
    const isFromScrollRef = React.useRef(false);

    // Sync State -> DOM (Programmatic Navigation)
    React.useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!enabled || !wrapper) {
            return;
        }

        // Skip if currently scrolling
        if (isFromScrollRef.current) {
            return;
        }

        const targetElement = wrapper.children[activeIndex] as HTMLElement;
        if (!targetElement) return;

        let newScrollLeft = targetElement.offsetLeft;
        if (targetElement.offsetParent !== wrapper) {
            newScrollLeft -= wrapper.offsetLeft + wrapper.clientLeft;
        }
        if (Math.abs(wrapper.scrollLeft - newScrollLeft) < 1) {
            return;
        }

        isAutoScrollRef.current = true;
        wrapper.scrollTo({
            left: newScrollLeft,
            behavior: !isReducedMotion() ? 'smooth' : undefined,
        });
    }, [activeIndex, enabled, wrapperRef]);

    // Sync DOM -> State (User Interaction)
    React.useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!enabled || !wrapper) return undefined;

        const controller = new AbortController();
        const { signal } = controller;

        const handleScroll = () => {
            // Skip if currently scrolling programmatically
            if (isAutoScrollRef.current) {
                return;
            }

            const { scrollLeft, clientWidth } = wrapper;
            const newIndex = Math.round(scrollLeft / clientWidth);

            isFromScrollRef.current = true;
            onChange?.(newIndex);
        };

        const reset = () => {
            isAutoScrollRef.current = false;
            isFromScrollRef.current = false;
        };

        wrapper.addEventListener('scroll', handleScroll, { signal });
        onScrollEnd(wrapper, reset, { signal });
        return () => controller.abort();
    }, [enabled, onChange, wrapperRef]);
};
