/** Check if the focus is visible on the given element */
export const isFocusVisible = (element?: HTMLElement) =>
    element?.matches?.(':focus-visible, [data-focus-visible-added]');
