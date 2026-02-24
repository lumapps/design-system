import { onBeforeUnmount, type Ref } from 'vue';
import { getFirstAndLastFocusable } from '@lumx/core/js/utils/focus/getFirstAndLastFocusable';

/**
 * Restores focus to the anchor or parent element when the popover is unmounted,
 * if focus was within the popover at the time of unmount.
 *
 * @param focusAnchorOnClose Whether to restore focus on close.
 * @param anchorRef          Reference to the anchor element.
 * @param parentElementRef   Reference to the parent element (optional override for focus target).
 * @param popoverElementRef  Reference to the popover element.
 */
export function useRestoreFocusOnClose(
    focusAnchorOnClose: Ref<boolean | undefined>,
    anchorRef: Ref<HTMLElement | undefined>,
    parentElementRef: Ref<HTMLElement | undefined> | undefined,
    popoverElementRef: Ref<HTMLElement | undefined>,
): void {
    onBeforeUnmount(() => {
        const popoverElement = popoverElementRef.value;
        if (!popoverElement || !focusAnchorOnClose.value) return;

        const isFocusWithin = popoverElement.contains(document.activeElement);
        if (!isFocusWithin) return;

        // On next render
        setTimeout(() => {
            const anchor = anchorRef.value;
            const elementToFocus =
                // Provided parent element
                parentElementRef?.value ||
                // Or first focusable element in anchor
                (anchor ? getFirstAndLastFocusable(anchor).first : undefined) ||
                // Fallback to anchor
                anchor;

            elementToFocus?.focus({ preventScroll: true });
        }, 0);
    });
}
