import { RefObject, useEffect, useRef, useState } from 'react';
import { userHasReducedMotion } from '@lumx/react/utils/userHasReducedMotion';

/**
 * Returns true if the component is visible tracking the opacity transition.
 *
 * @param ref Element on which to listen the transition event.
 * @param isComponentVisible Whether the component intends to be visible or not.
 * @param onVisibilityChange Callback called when the visibility changes.
 * @return true if the component should be rendered
 */
export const useTransitionVisibility = (
    ref: RefObject<HTMLElement>,
    isComponentVisible: boolean,
    onVisibilityChange?: (isVisible: boolean) => void,
) => {
    const [isVisible, setVisible] = useState(isComponentVisible);
    const previousVisibility = useRef(isVisible);

    // On component visibility change.
    useEffect(() => {
        if (isComponentVisible) {
            setVisible(true);
            return undefined;
        }
        const { current: element } = ref;

        // Transition event is not supported or the user prefers reduced motion.
        // => Skip `transitionend` event listening and set visibility to false directly.
        if (!element || !window.TransitionEvent || userHasReducedMotion()) {
            setVisible(false);
            return undefined;
        }

        // Update visibility on opacity transition end.
        const onTransitionEnd = (e: TransitionEvent) => {
            if (e.target !== ref.current || e.propertyName !== 'opacity') return;
            setVisible((wasVisible) => !wasVisible);
        };
        element.addEventListener('transitionend', onTransitionEnd);
        return () => {
            element.removeEventListener('transitionend', onTransitionEnd);
        };
    }, [isComponentVisible, ref]);

    useEffect(() => {
        if (onVisibilityChange && previousVisibility.current !== isVisible) {
            onVisibilityChange(isVisible);
            previousVisibility.current = isVisible;
        }
    }, [isVisible, onVisibilityChange]);

    return isVisible || isComponentVisible;
};
