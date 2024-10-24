import { getFocusableElements } from './getFocusableElements';

/**
 * Get first and last elements focusable in an element.
 *
 * @param parentElement The element in which to search focusable elements.
 * @return first and last focusable elements
 */
export function getFirstAndLastFocusable(parentElement: HTMLElement | ShadowRoot) {
    const focusableElements = getFocusableElements(parentElement);

    // First non disabled element.
    const first = focusableElements[0];
    // Last non disabled element.
    const last = focusableElements[focusableElements.length - 1];

    if (last && first) {
        return { first, last };
    }
    return {};
}
