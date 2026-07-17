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
        if (!element || !callback) {
            return undefined;
        }

        return setupInfiniteScrollObserver(element, callback, options);
        // `options?.root` starts as `null` (before the scrollable list's ref attaches) and is
        // then set to the real element — must be a dep, or the observer gets stuck watching
        // the wrong root (falling back to the viewport) for the component's whole lifetime.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef.current, callback, options?.root]);

    return UI({ ref: elementRef });
};
