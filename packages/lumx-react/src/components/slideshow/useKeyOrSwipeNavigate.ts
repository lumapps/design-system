import { useEffect } from 'react';
import { detectSwipe } from '@lumx/core/js/utils';

/**
 * Listen keyboard and swipe to navigate left and right.
 */
export function useKeyOrSwipeNavigate(
    element?: HTMLElement | null,
    onNext?: () => void,
    onPrevious?: () => void,
): void {
    useEffect(() => {
        if (!element) return undefined;

        const onNavigate = (evt: KeyboardEvent | string) => {
            let callback;
            if (typeof evt === 'string' ? evt === 'right' : evt?.key === 'ArrowRight') {
                callback = onPrevious;
            } else if (typeof evt === 'string' ? evt === 'left' : evt?.key === 'ArrowLeft') {
                callback = onNext;
            }

            callback?.();
            if (callback && typeof evt !== 'string') {
                evt.preventDefault();
                evt.stopPropagation();
            }
        };

        element.addEventListener('keydown', onNavigate);
        const removeSwipeListeners = detectSwipe(element, onNavigate);
        return () => {
            element.removeEventListener('keydown', onNavigate);
            removeSwipeListeners();
        };
    }, [onPrevious, onNext, element]);
}
