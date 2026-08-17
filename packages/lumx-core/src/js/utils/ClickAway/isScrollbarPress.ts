/** Border box of the root element: the viewport, at any document scroll position. */
const VIEWPORT_BOX = { left: 0, top: 0, scaleX: 1, scaleY: 1 };

/** Computed overflow values that render a scrollbar. `overlay` is legacy but still in the wild. */
const SCROLLABLE_OVERFLOW = ['auto', 'scroll', 'overlay'];

/**
 * Border box of an element in viewport coordinates, with the scale its CSS transform applies.
 *
 * `getBoundingClientRect` is transformed while the `client*` metrics are not, so a press has to be
 * scaled back into layout space before the two are compared.
 */
function getBorderBox(target: HTMLElement) {
    const { left, top, width, height } = target.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = target;
    return {
        left,
        top,
        scaleX: offsetWidth ? width / offsetWidth : 1,
        scaleY: offsetHeight ? height / offsetHeight : 1,
    };
}

/** Check if an axis renders a scrollbar. `hidden`, `clip` and `visible` overflow without one. */
function rendersScrollbar(overflow: string, isRoot: boolean): boolean {
    // The root element hands its overflow to the viewport, where `visible` behaves as `auto`.
    return SCROLLABLE_OVERFLOW.includes(overflow) || (isRoot && overflow === 'visible');
}

/**
 * Check if a mouse press landed in the scrollbar gutter of the element it targets.
 *
 * A browser dispatches a `mousedown` on the scrolling element when you press its scrollbar, and that
 * element is an ancestor of any popover it holds, so click away detection has to ignore the press.
 *
 * Touch is out of scope: a touch has no scrollbar to hit, and `TouchEvent` carries no coordinates.
 *
 * @param event - The press event.
 * @param target - The element the press landed on.
 * @returns `true` if the press landed on a scrollbar of `target`.
 */
export function isScrollbarPress(event: Event, target: EventTarget | null): boolean {
    if (!(event instanceof MouseEvent) || !(target instanceof HTMLElement)) {
        return false;
    }

    const { clientLeft, clientTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = target;
    // A hidden or detached element has no client box, so it renders no scrollbar.
    if (!clientWidth && !clientHeight) {
        return false;
    }

    // The root element's border box moves with the scroll position, so measure against the viewport.
    const isRoot = target === target.ownerDocument.documentElement;
    const { left, top, scaleX, scaleY } = isRoot ? VIEWPORT_BOX : getBorderBox(target);
    // `clientLeft` and `clientTop` cover a scrollbar placed before the padding edge, as in RTL.
    const offsetX = (event.clientX - left) / scaleX - clientLeft;
    const offsetY = (event.clientY - top) / scaleY - clientTop;

    // A vertical scrollbar sits beside the client box, so it shows up on X. Horizontal mirrors it.
    const beyondClientBoxX = offsetX < 0 || offsetX > clientWidth;
    const beyondClientBoxY = offsetY < 0 || offsetY > clientHeight;
    if (!beyondClientBoxX && !beyondClientBoxY) {
        return false;
    }

    // The border sits outside the client box too, hence the overflow checks.
    const { overflowX, overflowY } = getComputedStyle(target);
    return (
        (beyondClientBoxX && scrollHeight > clientHeight && rendersScrollbar(overflowY, isRoot)) ||
        (beyondClientBoxY && scrollWidth > clientWidth && rendersScrollbar(overflowX, isRoot))
    );
}
