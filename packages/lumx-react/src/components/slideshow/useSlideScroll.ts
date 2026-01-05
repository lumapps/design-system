import React from 'react';
import debounce from 'lodash/debounce';
import { isReducedMotion } from '@lumx/react/utils/browser/isReducedMotion';

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
 * It syncs the scroll position with the active index and vice-versa.
 */
export const useSlideScroll = ({ enabled, activeIndex, wrapperRef, onChange }: UseSlideScrollParams) => {
    const isAutoScrollRef = React.useRef(false);

    // Sync State -> DOM (Programmatic Navigation)
    React.useEffect(() => {
        if (!enabled || !wrapperRef.current) return;

        const wrapper = wrapperRef.current;
        const targetElement = wrapper.children[activeIndex] as HTMLElement;
        if (!targetElement) return;

        isAutoScrollRef.current = true;
        wrapper.scrollTo({
            left: targetElement.offsetLeft,
            behavior: !isReducedMotion() ? 'smooth' : undefined,
        });
    }, [activeIndex, enabled, wrapperRef]);

    // Sync DOM -> State (User Interaction)
    React.useEffect(() => {
        if (!enabled || !wrapperRef.current) return undefined;

        const wrapper = wrapperRef.current;

        const handleScroll = debounce(() => {
            const { scrollLeft, clientWidth } = wrapper;
            const newIndex = Math.round(scrollLeft / clientWidth);

            // Skip onChange when scroll triggered in previous useEffect
            if (!isAutoScrollRef.current) {
                onChange?.(newIndex);
            }
            isAutoScrollRef.current = false;
        }, 100);

        wrapper.addEventListener('scroll', handleScroll);

        return () => {
            wrapper.removeEventListener('scroll', handleScroll);
            handleScroll.cancel();
        };
    }, [enabled, onChange, wrapperRef, activeIndex]);
};
