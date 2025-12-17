/**
 * Checks whether the browser support passive events.
 * @see https://github.com/Modernizr/Modernizr/blob/6d56d814b9682843313b16060adb25a58d83a317/feature-detects/dom/passiveeventlisteners.js
 */
function isPassiveEventAvailable() {
    let supportsPassiveOption = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() {
                supportsPassiveOption = true;
            },
        });
        window.addEventListener('testPassiveEventSupport', () => {}, opts);
        window.removeEventListener('testPassiveEventSupport', () => {}, opts);
    } catch (e) {
        // ignored
    }
    return supportsPassiveOption;
}

/**
 * Detects horizontal swipe direction without blocking the browser scroll using passive event.
 * @see http://javascriptkit.com/javatutors/touchevents2.shtml
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export function detectHorizontalSwipe(touchSurface: Element, handleSwipe: (direction: 'right' | 'left') => void) {
    let startX: number;
    let startY: number;
    // Required min distance traveled to be considered swipe.
    const threshold = 150;
    // Maximum distance allowed at the same time in perpendicular direction.
    const restraint = 150;
    // Maximum time allowed to travel that distance.
    const allowedTime = 300;
    let elapsedTime: number;
    let startTime: number;
    let finished: boolean;

    const onTouchStart = (evt: Event) => {
        const [touch] = Array.from((evt as TouchEvent).changedTouches);
        startX = touch.pageX;
        startY = touch.pageY;
        // Record time when finger first makes contact with surface.
        startTime = new Date().getTime();
        finished = false;
    };

    const onTouchMove = (evt: Event) => {
        if (finished) {
            return;
        }

        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime > allowedTime) {
            // Touch swipe too long to be considered.
            return;
        }

        const [touch] = Array.from((evt as TouchEvent).changedTouches);
        // Get horizontal dist traveled by finger while in contact with surface.
        const distX = touch.pageX - startX;
        // Get vertical dist traveled by finger while in contact with surface.
        const distY = touch.pageY - startY;

        if (!(Math.abs(distX) >= threshold && Math.abs(distY) <= restraint)) {
            // Swipe is not horizontal.
            return;
        }
        // Swipe direction.
        const direction = distX < 0 ? 'left' : 'right';

        handleSwipe(direction);
        finished = true;
    };

    // Activate passive event if possible for better scrolling performance.
    const eventOptions: any = isPassiveEventAvailable() ? { passive: true } : false;
    touchSurface.addEventListener('touchstart', onTouchStart, eventOptions);
    touchSurface.addEventListener('touchmove', onTouchMove, eventOptions);

    return () => {
        touchSurface.removeEventListener('touchstart', onTouchStart, eventOptions);
        touchSurface.removeEventListener('touchmove', onTouchMove, eventOptions);
    };
}
