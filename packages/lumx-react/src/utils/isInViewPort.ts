export type ViewPortVisibility = 'full' | 'partial';

/**
 * Test if an element is in the viewport.
 *
 * @param bounding Bounding of element to test.
 * @param visibility Visible only partially or fully.
 * @return Whether the element to test is in viewport.
 */
export const isInViewPort = (bounding: ClientRect | DOMRect, visibility: ViewPortVisibility): boolean => {
    if (visibility === 'partial') {
        return (
            bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            bounding.right >= 0 &&
            bounding.bottom >= 0
        );
    }

    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
};
