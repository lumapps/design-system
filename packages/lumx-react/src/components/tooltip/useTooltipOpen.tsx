import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { createTooltipOpenManager, TooltipOpenManager } from '@lumx/core/js/components/Tooltip/tooltipOpenManager';
import { useEventCallback } from '@lumx/react/hooks/useEventCallback';

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param  delay         Delay in millisecond to display the tooltip.
 * @param  anchorElement Tooltip anchor element.
 * @param  onOpen        Called each time the open delay ends, before the state changes.
 * @return whether the anchor activates the tooltip, the popper mount callback and a close callback.
 */
export function useTooltipOpen(delay: number | undefined, anchorElement: HTMLElement | null, onOpen?: () => void) {
    const [isOpen, setIsOpen] = useState(false);

    const onPopperMount = useRef<any>(null) as MutableRefObject<(elem: HTMLElement | null) => void>;
    const managerRef = useRef<TooltipOpenManager | null>(null);
    const handleOpen = useEventCallback(onOpen);

    const close = useCallback(() => managerRef.current?.close(), []);

    useEffect(() => {
        if (!anchorElement) {
            return undefined;
        }

        const manager = createTooltipOpenManager({
            delay,
            onStateChange: (value) => {
                if (value) handleOpen();
                setIsOpen(value);
            },
        });

        managerRef.current = manager;
        onPopperMount.current = (el: HTMLElement | null) => manager.attachPopper(el);

        manager.attachAnchor(anchorElement);
        return () => {
            manager.destroy();
            // The manager dies with the anchor, so the open state must die with it.
            setIsOpen(false);
        };
    }, [anchorElement, delay, handleOpen]);

    return { isOpen, onPopperMount: onPopperMount.current, close };
}
