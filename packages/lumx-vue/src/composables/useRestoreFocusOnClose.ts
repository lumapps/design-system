import { onBeforeUnmount, watch, type Ref } from 'vue';
import { getFirstAndLastFocusable } from '@lumx/core/js/utils/focus/getFirstAndLastFocusable';

/**
 * Restores focus to the anchor or parent element when the popover closes,
 * if focus was within the popover at the time it closed.
 *
 * Works both when `isOpen` toggles to false (before Vue re-renders)
 * and when the component unmounts entirely.
 *
 * @param focusAnchorOnClose Whether to restore focus on close.
 * @param anchorRef          Reference to the anchor element.
 * @param parentElementRef   Reference to the parent element (optional override for focus target).
 * @param popoverElementRef  Reference to the popover element.
 * @param isOpenRef          Whether the popover is open (used to detect close before DOM update).
 */
export function useRestoreFocusOnClose(
    focusAnchorOnClose: Ref<boolean | undefined>,
    anchorRef: Ref<HTMLElement | undefined>,
    parentElementRef: Ref<HTMLElement | undefined> | undefined,
    popoverElementRef: Ref<HTMLElement | undefined>,
    isOpenRef?: Ref<boolean>,
): void {
    const tryRestoreFocus = () => {
        if (!focusAnchorOnClose.value) return;
        const popoverElement = popoverElementRef.value;
        if (!popoverElement) return;

        const isFocusWithin = popoverElement.contains(document.activeElement);
        if (!isFocusWithin) return;

        // On next render
        setTimeout(() => {
            const anchorValue = anchorRef.value;
            // Resolve DOM element: in Vue 3, a ref on a component gives the component instance.
            // The actual DOM element is accessed via `$el` on the component instance.
            const anchor: HTMLElement | undefined =
                anchorValue && '$el' in (anchorValue as any)
                    ? (anchorValue as any).$el
                    : (anchorValue as HTMLElement | undefined);
            const elementToFocus =
                // Provided parent element
                parentElementRef?.value ||
                // Or first focusable element in anchor
                (anchor instanceof HTMLElement ? getFirstAndLastFocusable(anchor).first : undefined) ||
                // Fallback to anchor
                anchor;

            elementToFocus?.focus({ preventScroll: true });
        }, 0);
    };

    if (isOpenRef) {
        // Watch isOpen with flush:'sync' so the callback runs synchronously before
        // Vue re-renders and removes the popover element from the DOM.
        // This allows us to check focus state while the popover is still in the DOM.
        watch(
            isOpenRef,
            (isOpen, wasOpen) => {
                if (wasOpen && !isOpen) {
                    tryRestoreFocus();
                }
            },
            { flush: 'sync' },
        );
    }

    // Also handle the case where the Vue component itself unmounts while the popover is open.
    onBeforeUnmount(() => {
        tryRestoreFocus();
    });
}
