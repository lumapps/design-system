/**
 * Polyfill-like helper for the scrollend event.
 * Uses native scrollend if available, otherwise falls back to a timeout.
 *
 * @param element The element to listen to.
 * @param callback The callback to execute when scrolling ends.
 * @param options Options for the listener (timeout and AbortSignal).
 */
export function onScrollEnd(
    element: HTMLElement,
    callback: () => void,
    options: { timeout?: number; signal?: AbortSignal } = {},
) {
    const { timeout = 150, signal } = options;

    // Native scrollend
    if ('onscrollend' in window) {
        element.addEventListener('scrollend', callback, { signal });
        return;
    }

    // Fallback for browsers that don't support scrollend
    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
        clearTimeout(timer);
        timer = setTimeout(callback, timeout);
    };
    element.addEventListener('scroll', handleScroll, { signal });
    signal?.addEventListener('abort', () => clearTimeout(timer));
}
