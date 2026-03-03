import React from 'react';
import { getFirstAndLastFocusable } from '@lumx/core/js/utils/focus/getFirstAndLastFocusable';
import { OnBeforeUnmount } from '@lumx/react/utils/react/OnBeforeUnmount';
import type { PopoverProps } from '../components/popover/Popover';

/**
 * Provides an unmount sentinel to inject in the popover to detect when it closes and restore the focus to the
 * anchor if needed.
 */
export function useRestoreFocusOnClose(
    {
        focusAnchorOnClose,
        anchorRef,
        parentElement,
    }: Pick<PopoverProps, 'focusAnchorOnClose' | 'anchorRef' | 'parentElement'>,
    popoverElement?: HTMLElement | null,
    isOpen?: boolean,
) {
    const onBeforeUnmountRef = React.useRef<(() => void) | undefined>();
    const prevIsOpenRef = React.useRef(isOpen);

    const tryRestoreFocus = React.useCallback(() => {
        if (!popoverElement || !focusAnchorOnClose) return;
        const isFocusWithin = popoverElement.contains(document.activeElement);
        if (!isFocusWithin) return;

        // On next render
        setTimeout(() => {
            const anchor = anchorRef.current;
            const elementToFocus =
                // Provided parent element
                parentElement?.current ||
                // Or first focusable element in anchor
                (anchor ? getFirstAndLastFocusable(anchor).first : undefined) ||
                // Fallback to anchor
                anchor;

            elementToFocus?.focus({ preventScroll: true });
        }, 0);
    }, [anchorRef, focusAnchorOnClose, parentElement, popoverElement]);

    React.useEffect(() => {
        if (!popoverElement || !focusAnchorOnClose) {
            onBeforeUnmountRef.current = undefined;
            return;
        }
        onBeforeUnmountRef.current = tryRestoreFocus;
    }, [focusAnchorOnClose, popoverElement, tryRestoreFocus]);

    // Handle closeMode="hide": detect isOpen going from true to false (popover stays mounted).
    React.useEffect(() => {
        if (prevIsOpenRef.current && !isOpen) {
            tryRestoreFocus();
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, tryRestoreFocus]);

    return <OnBeforeUnmount callbackRef={onBeforeUnmountRef} />;
}
