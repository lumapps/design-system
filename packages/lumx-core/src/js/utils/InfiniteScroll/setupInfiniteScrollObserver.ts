type EventCallback = (evt?: Event) => void;

/**
 * Sets up an IntersectionObserver on the given element.
 * Calls `callback` when at least one observed entry is intersecting.
 * Returns a cleanup function that unobserves the element.
 */
export function setupInfiniteScrollObserver(
    element: Element,
    callback: EventCallback,
    options?: IntersectionObserverInit,
): () => void {
    const observer = new IntersectionObserver((entries = []) => {
        const hasIntersection = entries.some((entry) => entry.isIntersecting);

        if (!hasIntersection) {
            return;
        }

        callback();
    }, options);

    observer.observe(element);

    return () => {
        observer.unobserve(element);
    };
}
