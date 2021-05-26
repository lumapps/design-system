import { useEffect } from 'react';
import { detectHorizontalSwipe } from '@lumx/core/js/utils';

const isTouchDevice = () => 'ontouchstart' in window;

/**
 * Listen swipe to navigate left and right.
 */
export function useSwipeNavigate(element?: HTMLElement | null, onNext?: () => void, onPrevious?: () => void): void {
    useEffect(() => {
        if (!element || !isTouchDevice()) return undefined;

        return detectHorizontalSwipe(element, (swipe) => {
            const callback = swipe === 'right' ? onPrevious : onNext;
            callback?.();
        });
    }, [onPrevious, onNext, element]);
}
