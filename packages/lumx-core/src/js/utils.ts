import classNames from 'classnames';

import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import noop from 'lodash/noop';

import { ESCAPE_KEY_CODE } from './constants';

/**
 * Enhance isEmpty method to also works with numbers.
 *
 * @param  value The value to check.
 * @return Whether the input value is empty or != 0.
 */
// tslint:disable-next-line:variable-name
const _isEmpty = (value: any) => {
    if (typeof value === 'number') {
        return value === 0;
    }

    return isEmpty(value);
};
type Callback = () => void;

/**
 * Get the basic CSS class for the given type.
 *
 * @param  prefix The class name prefix for the generated CSS class.
 * @param  type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return The basic CSS class.
 */
function getBasicClass({
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
function handleBasicClasses({ prefix, ...props }: { prefix: string; [prop: string]: any }): string {
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
 * @param  touchSurface          Element that will hold touch events.
 * @param  handleSwipe Callback function.
 * @return Function to remove listeners.
 */
function detectSwipe(touchSurface: Element, handleSwipe: (direction: SwipeDirection) => void = noop) {
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
 * Make sure the pressed key is the enter key before calling the callback.
 *
 * @param  cb The callback to call on enter/return press.
 * @return The decorated function.
 */
function onEnterPressed(cb: Callback) {
    return (evt: { key: string }) => {
        if (evt.key !== 'Enter') {
            return;
        }
        cb();
    };
}

/**
 * Make sure the pressed key is the escape key before calling the callback.
 *
 * @param  cb The callback to call on escape press.
 * @return The decorated function.
 */
function onEscapePressed(cb: Callback) {
    return (evt: { keyCode: number }) => {
        if (evt.keyCode !== ESCAPE_KEY_CODE) {
            return;
        }
        cb();
    };
}

export { getBasicClass, handleBasicClasses, detectSwipe, onEnterPressed, onEscapePressed };
