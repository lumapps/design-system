/**
 * Create a TreeWalker that iterates over elements matching a CSS selector
 * within a container.
 *
 * Uses `NodeFilter.SHOW_ELEMENT` and accepts nodes that match the given
 * selector, skipping everything else. The returned walker can be used with
 * `nextNode()` / `previousNode()` for lazy, sequential DOM traversal.
 *
 * @param container The root element to walk within.
 * @param selector CSS selector that items must match.
 * @returns A TreeWalker scoped to the container and filtered by the selector.
 */
export function createSelectorTreeWalker(container: HTMLElement, selector: string): TreeWalker {
    return document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node: Node) {
            return (node as HTMLElement).matches(selector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
    });
}
