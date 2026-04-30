/** CSS selector listing all tabbable elements. */
export const TABBABLE_ELEMENTS_SELECTOR =
    'a[href], button, textarea, input:not([type="hidden"]):not([hidden]), [tabindex]';

/**
 * CSS selector matching elements that should be excluded from focus traversal.
 *
 * Note: `aria-disabled` is intentionally NOT in this list — per ARIA semantics, an `aria-disabled` element
 * remains focusable (and discoverable by assistive tech). To remove an element from the tab order, use
 * `tabindex="-1"` instead.
 */
export const DISABLED_SELECTOR = '[hidden], [tabindex="-1"], [disabled]:not([disabled="false"])';
