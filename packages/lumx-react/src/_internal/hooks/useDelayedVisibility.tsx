import { useEffect, useState, useRef } from 'react';

/**
 * Returns true if the component is visible taking into account the component's
 * own visibility and the animations delay
 *
 * @param isComponentVisible Whether the component intends to be visible or not.
 * @param transitionDuration time in ms that the transition takes for the specific component.
 * @param onVisibilityChange Callback called when the visibility changes.
 * @return true if the component should be rendered
 */
export function useDelayedVisibility(
    isComponentVisible: boolean,
    transitionDuration: number,
    onVisibilityChange?: (isVisible: boolean) => void,
): boolean {
    // Delay visibility to account for the 400ms of CSS opacity animation.
    const [isVisible, setVisible] = useState(isComponentVisible);

    useEffect(() => {
        if (isComponentVisible) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), transitionDuration);
        }
    }, [isComponentVisible, transitionDuration]);

    /**
     * Since we don't want onVisibiltyChange function to trigger itself if when it changes,
     * we store the previous visibility and only trigger when visibility is different
     * than previous value.
     */

    const previousVisibility = useRef(isVisible);

    useEffect(() => {
        if (onVisibilityChange && previousVisibility.current !== isVisible) {
            onVisibilityChange(isVisible);
            previousVisibility.current = isVisible;
        }
    }, [isVisible, onVisibilityChange]);

    return isComponentVisible || isVisible;
}
