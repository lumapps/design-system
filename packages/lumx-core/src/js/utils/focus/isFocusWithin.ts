/**
 * Check if the focus is on the given element or inside it.
 *
 * Reads the active element of the element's own root node (Document or ShadowRoot), so it also works when the
 * element lives in a shadow DOM.
 *
 * @param  element The element to check.
 * @return whether the active element is the element itself or one of its descendants.
 */
export function isFocusWithin(element: Element | null | undefined): boolean {
    if (!element) return false;
    const { activeElement } = element.getRootNode() as Document | ShadowRoot;
    return Boolean(activeElement && element.contains(activeElement));
}
