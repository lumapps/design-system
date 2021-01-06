import { useMemo, useRef } from 'react';
import { EDGE_FROM_ACTIVE_INDEX, PAGINATION_ITEMS_MAX } from '@lumx/react/components/slideshow/constants';

type Range = { min: number; max: number };

/**
 * Calculate the currently visible pagination "bullet" range.
 */
export function usePaginationVisibleRange(activeIndex: number, slideCount: number): Range {
    const previousVisibleRangeRef = useRef<Range>();
    return useMemo(() => {
        const lastSlide = slideCount - 1;
        const { current: previousVisibleRange } = previousVisibleRangeRef;
        let newVisibleRange: Range;
        if (activeIndex === previousVisibleRange?.max && activeIndex < lastSlide) {
            newVisibleRange = { min: previousVisibleRange.min + 1, max: previousVisibleRange.max + 1 };
        } else if (activeIndex === previousVisibleRange?.min && activeIndex > 0) {
            newVisibleRange = { min: previousVisibleRange.min - 1, max: previousVisibleRange.max - 1 };
        } else {
            const deltaItems = PAGINATION_ITEMS_MAX - 1;
            let min = activeIndex - EDGE_FROM_ACTIVE_INDEX;
            let max = activeIndex + EDGE_FROM_ACTIVE_INDEX;

            if (activeIndex > lastSlide - EDGE_FROM_ACTIVE_INDEX) {
                min = lastSlide - deltaItems;
                max = lastSlide;
            } else if (activeIndex < deltaItems) {
                min = 0;
                max = deltaItems;
            }

            newVisibleRange = { min, max };
        }
        previousVisibleRangeRef.current = newVisibleRange;
        return newVisibleRange;
    }, [activeIndex, slideCount]);
}
