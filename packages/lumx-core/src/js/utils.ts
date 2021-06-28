import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';

import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import noop from 'lodash/noop';

/**
 * Enhance isEmpty method to also works with numbers.
 *
 * @param  value The value to check.
 * @return Whether the input value is empty or != 0.
 */
const _isEmpty = (value: any) => {
    if (typeof value === 'number') {
        return value === 0;
    }

    return isEmpty(value);
};

/**
 * Get the basic CSS class for the given type.
 *
 * @param  prefix The class name prefix for the generated CSS class.
 * @param  type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return The basic CSS class.
 */
export function getBasicClass({
    prefix,
    type,
    value,
}: {
    prefix: string;
    type: string;
    value: string | number | boolean | undefined;
}): string {
    if (isBoolean(value)) {
        if (!value) {
            // False value should not return a class.
            return '';
        }
        const booleanPrefixes = ['has', 'is'];

        if (booleanPrefixes.some((booleanPrefix) => type.toString().startsWith(booleanPrefix))) {
            return `${prefix}--${kebabCase(type)}`;
        }

        return `${prefix}--is-${kebabCase(type)}`;
    }

    return `${prefix}--${kebabCase(type)}-${value}`;
}

/**
 * Return all basic LumX CSS classes which are available for every components.
 *
 * @see {@link /src/components/index.d.ts} for the possible values of each parameter.
 *
 * @param  prefix The class name prefix for the generated CSS class.
 * @param  props  All the other props you want to generate a class.
 *                The rule of thumb: the key is the name of the prop in the class, the value a string that will
 *                be used in the classname to represent the value of the given prop.
 * @return All LumX basic CSS classes.
 */
export function handleBasicClasses({ prefix, ...props }: { prefix: string; [prop: string]: any }): string {
    const otherClasses: any = {};
    if (!isEmpty(props)) {
        Object.keys(props).forEach((prop) => {
            otherClasses[getBasicClass({ prefix, type: prop, value: props[prop] })] = isBoolean(props[prop])
                ? props[prop]
                : !_isEmpty(props[prop]);
        });
    }

    return classNames(prefix, otherClasses);
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
        window.addEventListener('testPassiveEventSupport', noop, opts);
        window.removeEventListener('testPassiveEventSupport', noop, opts);
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

type KeyboardEventHandler<E extends KeyboardEvent | React.KeyboardEvent> = (event: E) => void;

/**
 * Make sure the pressed key is the enter key before calling the callback.
 *
 * @param  handler The handler to call on enter/return press.
 * @return The decorated function.
 */
export function onEnterPressed<E extends KeyboardEvent | React.KeyboardEvent>(
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
export function onEscapePressed<E extends KeyboardEvent | React.KeyboardEvent>(
    handler: KeyboardEventHandler<E>,
): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Escape') {
            return;
        }
        handler(evt);
    };
}
