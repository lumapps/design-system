import React from 'react';
import { getFirstAndLastFocusable } from '@lumx/react/utils/focus/getFirstAndLastFocusable';
import { useBeforeUnmountSentinel } from '@lumx/react/utils/useBeforeUnmountSentinel';
import type { PopoverProps } from './Popover';

/**
 * Provides an unmount sentinel to inject in the popover to detect when it closes and restore the focus to the
 * anchor if needed.
 */
export function useRestoreFocusOnClose(
    props: Pick<PopoverProps, 'focusAnchorOnClose' | 'anchorRef' | 'parentElement'>,
    popoverElement?: HTMLElement | null,
) {
    const onBeforeUnmount = React.useMemo(() => {
        if (!popoverElement || !props.focusAnchorOnClose) return undefined;
        return () => {
            const isFocusWithin = popoverElement?.contains(document.activeElement);
            if (!isFocusWithin) return;

            const anchor = props.anchorRef.current;
            const elementToFocus =
                // Provided parent element
                props.parentElement?.current ||
                // Or first focusable element in anchor
                (anchor ? getFirstAndLastFocusable(anchor).first : undefined) ||
                // Fallback to anchor
                anchor;

            elementToFocus?.focus({ preventScroll: true });
        };
    }, [popoverElement, props.anchorRef, props.focusAnchorOnClose, props.parentElement]);
    return useBeforeUnmountSentinel(onBeforeUnmount);
}
