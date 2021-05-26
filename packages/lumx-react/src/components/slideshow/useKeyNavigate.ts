import { useEffect } from 'react';

/**
 * Listen keyboard to navigate left and right.
 */
export function useKeyNavigate(element?: HTMLElement | null, onNext?: () => void, onPrevious?: () => void): void {
    useEffect(() => {
        if (!element) return undefined;
        const onKeyNavigate = (evt: KeyboardEvent) => {
            let callback;
            if (evt?.key === 'ArrowRight') {
                callback = onPrevious;
            } else if (evt?.key === 'ArrowLeft') {
                callback = onNext;
            }
            if (!callback) return;

            callback();
            evt.preventDefault();
            evt.stopPropagation();
        };

        element.addEventListener('keydown', onKeyNavigate);
        return () => {
            element.removeEventListener('keydown', onKeyNavigate);
        };
    }, [onPrevious, onNext, element]);
}
