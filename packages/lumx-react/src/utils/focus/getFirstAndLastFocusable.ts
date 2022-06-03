/** CSS selector listing all tabbable elements. */
const TABBABLE_ELEMENTS_SELECTOR = `a[href], button, textarea, input:not([type="hidden"]), [tabindex]`;

/** CSS selector matching element that are disabled (should not receive focus). */
const DISABLED_SELECTOR = `[tabindex="-1"], [disabled]:not([disabled="false"]), [aria-disabled]:not([aria-disabled="false"])`;

const isNotDisabled = (element: HTMLElement) => !element.matches(DISABLED_SELECTOR);

/**
 * Get first and last elements focusable in an element.
 *
 * @param parentElement The element in which to search focusable elements.
 * @return first and last focusable elements
 */
export function getFirstAndLastFocusable(parentElement: HTMLElement) {
    const focusableElements = Array.from(parentElement.querySelectorAll<HTMLElement>(TABBABLE_ELEMENTS_SELECTOR));

    // First non disabled element.
    const first = focusableElements.find(isNotDisabled);
    // Last non disabled element.
    const last = focusableElements.reverse().find(isNotDisabled);

    if (last && first) {
        return { first, last };
    }
    return {};
}
