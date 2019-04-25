import { Color, Size, Theme } from 'LumX/components';

/////////////////////////////

/**
 * Get the basic CSS class for the given type.
 *
 * @param  {string}         prefix The class name prefix for the generated CSS class.
 * @param  {string}         type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  {string|boolean} value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return {string}         The basic CSS class.
 */
declare function getBasicClass({
    prefix,
    type,
    value,
}: {
    prefix: string;
    type: string;
    value: string | boolean;
}): string;

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
declare function handleBasicClasses({ prefix, ...props }: { prefix: string; [prop: string]: any }): string;

/**
 * Detects swipe direction.
 * Credits: http://javascriptkit.com/javatutors/touchevents2.shtml.
 *
 * @param {Element} el Element that will hold touch events.
 * @param {(swipeDirection: SwipeDirection) => void} cb Callback function.
 */
declare function detectSwipe(el: Element, cb: (swipeDirection: SwipeDirection) => void): void;

declare type SwipeDirection = 'none' | 'up' | 'down' | 'left' | 'right';

/////////////////////////////

export { getBasicClass, handleBasicClasses, detectSwipe, SwipeDirection };
