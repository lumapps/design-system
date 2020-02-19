import { useEffect, useState } from 'react';

/**
 * Returns true if the component is visible taking into account the component's
 * own visibility and the animations delay
 *
 * @param isComponentVisible Whether the component intends to be visible or not.
 * @param transitionDuration time in ms that the transition takes for the specific component.
 * @return true if the component should be rendered
 */
function useDelayedVisibility(isComponentVisible: boolean, transitionDuration: number) {
    // Delay visibility to account for the 400ms of CSS opacity animation.
    const [isVisible, setVisible] = useState(isComponentVisible);

    useEffect(() => {
        if (isComponentVisible) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), transitionDuration);
        }
    }, [isComponentVisible]);

    return isComponentVisible || isVisible;
}

export { useDelayedVisibility };
