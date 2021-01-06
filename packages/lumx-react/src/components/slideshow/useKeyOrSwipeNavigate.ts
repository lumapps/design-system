import { LEFT_KEY_CODE, RIGHT_KEY_CODE } from '@lumx/core/js/constants';
import { useEffect } from 'react';
import { detectSwipe } from '@lumx/core/js/utils';

/**
 * Listen keyboard and swipe to navigate left and right.
 */
export function useKeyOrSwipeNavigate(element?: HTMLElement | null, onNext?: () => void, onPrevious?: () => void) {
    useEffect(() => {
        if (!element) return undefined;

        const onNavigate = (evt: KeyboardEvent | string) => {
            if (typeof evt === 'string' ? evt === 'right' : evt?.keyCode === RIGHT_KEY_CODE) {
                onPrevious?.();
            } else if (typeof evt === 'string' ? evt === 'left' : evt?.keyCode === LEFT_KEY_CODE) {
                onNext?.();
            }

            if (typeof evt !== 'string') {
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
