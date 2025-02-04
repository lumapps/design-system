/** CSS selector listing all tabbable elements. */
export const TABBABLE_ELEMENTS_SELECTOR =
    'a[href], button, textarea, input:not([type="hidden"]):not([hidden]), [tabindex]';

/** CSS selector matching element that are disabled (should not receive focus). */
export const DISABLED_SELECTOR =
    '[hidden], [tabindex="-1"], [disabled]:not([disabled="false"]), [aria-disabled]:not([aria-disabled="false"])';
