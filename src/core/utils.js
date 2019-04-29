import classNames from 'classnames';

import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import { noop } from 'lodash/noop';

import { ENTER_KEY_CODE } from './constants';

/**
 * Enhance isEmpty method to also works with numbers.
 *
 * @param  {any}     value The value to check
 * @return {boolean} Weither if the input value is empty or != 0.
 */
const _isEmpty = (value) => {
    if (typeof value === 'number') {
        return value === 0;
    }

    return isEmpty(value);
};

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Get the basic CSS class for the given type.
 *
 * @param  {string}         prefix The class name prefix for the generated CSS class.
 * @param  {string}         type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  {string|boolean} value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return {string}         The basic CSS class.
 */
function getBasicClass({ prefix, type, value }) {
    if (isBoolean(value)) {
        return `${prefix}--is-${kebabCase(type)}`;
    }

    return `${prefix}--${kebabCase(type)}-${value}`;
}

/**
 * Return all basic LumX CSS classes which are available for every components.
 *
 * @see {@link /src/components/index.d.ts} for the possible values of each parameter.
 *
 * @param  {string} prefix The class name prefix for the generated CSS class.
 * @param  {Object} props  All the other props you want to generate a class.
 *                         The rule of thumb: the key is the name of the prop in the class, the value a string that will
 *                         be used in the classname to represent the value of the given prop.
 * @return {string} All LumX basic CSS classes.
 */
function handleBasicClasses({ prefix, ...props }) {
    const otherClasses = {};
    if (!isEmpty(props)) {
        Object.keys(props).forEach((prop) => {
            otherClasses[getBasicClass({ prefix, type: prop, value: props[prop] })] = isBoolean(props[prop])
                ? props[prop]
                : !_isEmpty(props[prop]);
        });
    }

    return classNames(prefix, otherClasses);
}

/**
 * Detects swipe direction.
 * Credits: http://javascriptkit.com/javatutors/touchevents2.shtml.
 *
 * @param  {Element}  el Element that will hold touch events.
 * @param  {Function} cb Callback function.
 * @return {Function} Function to remove listeners.
 */
function detectSwipe(el, cb = noop) {
    const touchsurface = el;
    let distX, distY, startX, startY, swipedir;
    // Required min distance traveled to be considered swipe.
    const threshold = 150;
    // Maximum distance allowed at the same time in perpendicular direction.
    const restraint = 100;
    // Maximum time allowed to travel that distance.
    const allowedTime = 300;
    let elapsedTime, startTime;
    const handleswipe = cb;

    const onTouchStart = (evt) => {
        const [touchobj] = evt.changedTouches;
        swipedir = 'none';
        // Const dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        // Record time when finger first makes contact with surface.
        startTime = new Date().getTime();
        evt.preventDefault();
    };

    const onTouchMove = (evt) => {
        // Prevent scrolling when inside DIV.
        evt.preventDefault();
    };

    const onTouchEnd = (evt) => {
        const [touchobj] = evt.changedTouches;
        // Get horizontal dist traveled by finger while in contact with surface.
        distX = touchobj.pageX - startX;
        // Get vertical dist traveled by finger while in contact with surface.
        distY = touchobj.pageY - startY;
        // Get time elapsed.
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime) {
            // First condition for awipe met.
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                // 2nd condition for horizontal swipe met.
                // If dist traveled is negative, it indicates left swipe.
                swipedir = distX < 0 ? 'left' : 'right';
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                // 2nd condition for vertical swipe met.
                // If dist traveled is negative, it indicates up swipe.
                swipedir = distY < 0 ? 'up' : 'down';
            }
        }
        handleswipe(swipedir);
        evt.preventDefault();
    };

    touchsurface.addEventListener('touchstart', onTouchStart, false);
    touchsurface.addEventListener('touchmove', onTouchMove, false);
    touchsurface.addEventListener('touchend', onTouchEnd, false);

    return () => {
        touchsurface.removeEventListener('touchstart', onTouchStart, false);
        touchsurface.removeEventListener('touchmove', onTouchMove, false);
        touchsurface.removeEventListener('touchend', onTouchEnd, false);
    };
}

/**
 * Make sure the pressed key is the enter key before calling the callbac.
 *
 * @param  {Function} cb The callback to call on enter/return press.
 * @return {Function} The decorated function.
 */
function onEnterPressed(cb) {
    return (evt) => {
        if (evt.keyCode !== ENTER_KEY_CODE) {
            return;
        }

        cb();
    };
}

/////////////////////////////

export { getBasicClass, handleBasicClasses, detectSwipe, onEnterPressed };
