import React from 'react';
import { getFirstAndLastFocusable } from '@lumx/react/utils/browser/focus/getFirstAndLastFocusable';
import { OnBeforeUnmount } from '@lumx/react/utils/OnBeforeUnmount';
import type { PopoverProps } from './Popover';

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
) {
    const onBeforeUnmountRef = React.useRef<(() => void) | undefined>();

    React.useEffect(() => {
        if (!popoverElement || !focusAnchorOnClose) {
            onBeforeUnmountRef.current = undefined;
            return;
        }

        onBeforeUnmountRef.current = () => {
            const isFocusWithin = popoverElement?.contains(document.activeElement);
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
        };
    }, [anchorRef, focusAnchorOnClose, parentElement, popoverElement]);

    return <OnBeforeUnmount callbackRef={onBeforeUnmountRef} />;
}
