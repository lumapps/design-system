/** Check if the focus is visible on the given element */
export const isFocusVisible = (element?: HTMLElement) => {
    try {
        return element?.matches?.(':focus-visible, [data-focus-visible-added]');
    } catch (_ignored) {
        // Can fail on non browser env
        return true;
    }
};
