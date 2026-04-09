import React, { useEffect } from 'react';
import {
    InfiniteScroll as UI,
    type InfiniteScrollProps,
    setupInfiniteScrollObserver,
} from '@lumx/core/js/utils/InfiniteScroll';

export type { InfiniteScrollProps };

/**
 * Handles basic callback pattern by using intersection observers.
 */
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ callback, options }) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const { current: element } = elementRef;
        if (!element) {
            return undefined;
        }

        return setupInfiniteScrollObserver(element, callback, options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef.current, callback]);

    return UI({ ref: elementRef });
};
