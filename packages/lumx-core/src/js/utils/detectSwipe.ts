import noop from 'lodash/noop';

declare type SwipeDirection = 'none' | 'up' | 'down' | 'left' | 'right';

/**
 * Detects swipe direction.
 * Credits: http://javascriptkit.com/javatutors/touchevents2.shtml.
 *
 * @deprecated use `detectHorizontalSwipe` instead if possible (better performance and does not block scroll)
 * @param  touchSurface          Element that will hold touch events.
 * @param  handleSwipe Callback function.
 * @return Function to remove listeners.
 */
export function detectSwipe(touchSurface: Element, handleSwipe: (direction: SwipeDirection) => void = noop) {
    let distX: number;
    let distY: number;
    let startX: number;
    let startY: number;
    let direction: SwipeDirection;
    // Required min distance traveled to be considered swipe.
    const threshold = 150;
    // Maximum distance allowed at the same time in perpendicular direction.
    const restraint = 100;
    // Maximum time allowed to travel that distance.
    const allowedTime = 300;
    let elapsedTime: number;
    let startTime: number;

    const onTouchStart = (evt: Event) => {
        const [touch] = Array.from((evt as TouchEvent).changedTouches);
        direction = 'none';
        // Const dist = 0;
        startX = touch.pageX;
        startY = touch.pageY;
        // Record time when finger first makes contact with surface.
        startTime = new Date().getTime();
        evt.preventDefault();
    };

    const onTouchMove = (evt: Event) => {
        // Prevent scrolling when inside DIV.
        evt.preventDefault();
    };

    const onTouchEnd = (evt: Event) => {
        const [touch] = Array.from((evt as TouchEvent).changedTouches);
        // Get horizontal dist traveled by finger while in contact with surface.
        distX = touch.pageX - startX;
        // Get vertical dist traveled by finger while in contact with surface.
        distY = touch.pageY - startY;
        // Get time elapsed.
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime) {
            // First condition for awipe met.
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                // 2nd condition for horizontal swipe met.
                // If dist traveled is negative, it indicates left swipe.
                direction = distX < 0 ? 'left' : 'right';
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                // 2nd condition for vertical swipe met.
                // If dist traveled is negative, it indicates up swipe.
                direction = distY < 0 ? 'up' : 'down';
            }
        }
        handleSwipe(direction);
        evt.preventDefault();
    };

    touchSurface.addEventListener('touchstart', onTouchStart, false);
    touchSurface.addEventListener('touchmove', onTouchMove, false);
    touchSurface.addEventListener('touchend', onTouchEnd, false);

    return () => {
        touchSurface.removeEventListener('touchstart', onTouchStart, false);
        touchSurface.removeEventListener('touchmove', onTouchMove, false);
        touchSurface.removeEventListener('touchend', onTouchEnd, false);
    };
}
