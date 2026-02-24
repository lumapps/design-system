import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { createTooltipOpenManager, TooltipOpenManager } from '@lumx/core/js/components/Tooltip/tooltipOpenManager';

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param  delay         Delay in millisecond to display the tooltip.
 * @param  anchorElement Tooltip anchor element.
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen(delay: number | undefined, anchorElement: HTMLElement | null) {
    const [isOpen, setIsOpen] = useState(false);

    const onPopperMount = useRef<any>(null) as MutableRefObject<(elem: HTMLElement | null) => void>;
    const managerRef = useRef<TooltipOpenManager | null>(null);

    // Global close on escape
    useCallbackOnEscape(isOpen ? () => managerRef.current?.close() : undefined);

    useEffect(() => {
        if (!anchorElement) {
            return undefined;
        }

        const manager = createTooltipOpenManager({
            delay,
            onStateChange: setIsOpen,
        });

        managerRef.current = manager;
        onPopperMount.current = (el: HTMLElement | null) => manager.attachPopper(el);

        manager.attachAnchor(anchorElement);
        return () => {
            manager.destroy();
        };
    }, [anchorElement, delay]);

    return { isOpen, onPopperMount: onPopperMount.current };
}
