import { visuallyHidden } from '../classNames/visually-hidden';

/**
 * Get the text of an element when it overflows, else `undefined`.
 */
export const getOverflowingText = (element?: HTMLElement | null): string | undefined => {
    // A visually hidden element measures 1px, so it would count as overflowing.
    if (!element || element.closest(`.${visuallyHidden()}`)) return undefined;
    // A hidden element measures 0, so it would count as overflowing.
    if (element.offsetWidth === 0 || element.offsetWidth >= element.scrollWidth) return undefined;
    return element.innerText;
};
