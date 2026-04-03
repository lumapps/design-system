/**
 * Like `querySelectorAll`, but also tests the root node itself.
 *
 * Yields the root element first (if it matches), then all matching descendants
 * in document order. Being a generator, callers that only need the first match
 * can break early without collecting the full list.
 *
 * @param node  The starting DOM node.
 * @param selector  CSS selector to match against.
 */
export function* querySelectorInclusive(node: Node, selector: string): Generator<HTMLElement> {
    if (!(node instanceof HTMLElement)) return;
    if (node.matches(selector)) yield node;
    yield* node.querySelectorAll<HTMLElement>(selector);
}
