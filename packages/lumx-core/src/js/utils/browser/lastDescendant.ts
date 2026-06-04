/** Deepest last-child descendant of `el` (or `el` itself if it has no children). */
export function lastDescendant(element: HTMLElement): HTMLElement {
    let node: Element = element;
    while (node.lastElementChild) node = node.lastElementChild;
    return node as HTMLElement;
}
