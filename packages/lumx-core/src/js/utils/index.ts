import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export * from './className';

type KeyboardEventHandler<E extends KeyboardEvent | ReactKeyboardEvent> = (event: E) => void;

/**
 * Make sure the pressed key is the enter key before calling the callback.
 *
 * @param  handler The handler to call on enter/return press.
 * @return The decorated function.
 */
export function onEnterPressed<E extends KeyboardEvent | ReactKeyboardEvent>(
    handler: KeyboardEventHandler<E>,
): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Enter') {
            return;
        }
        handler(evt);
    };
}

/**
 * Make sure the pressed key is the escape key before calling the callback.
 *
 * @param  handler The handler to call on enter/return press.
 * @return The decorated function.
 */
export function onEscapePressed<E extends KeyboardEvent | ReactKeyboardEvent>(
    handler: KeyboardEventHandler<E>,
): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Escape') {
            return;
        }
        handler(evt);
    };
}

/**
 * Handle button key pressed (Enter + Space).
 *
 * @param  handler The handler to call.
 * @return The decorated function.
 */
export function onButtonPressed<E extends KeyboardEvent | ReactKeyboardEvent>(
    handler: KeyboardEventHandler<E>,
): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Enter' && evt.key !== ' ') {
            return;
        }
        handler(evt);
    };
}

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
export function detectSwipe(touchSurface: Element, handleSwipe?: (direction: SwipeDirection) => void) {
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
        handleSwipe?.(direction);
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

/**
 * Checks whether or not the browser support passive events.
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
