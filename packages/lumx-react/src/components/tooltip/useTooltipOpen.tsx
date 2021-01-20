import { onEscapePressed } from '@lumx/react/utils';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param  delay         Delay in millisecond to display the tooltip.
 * @param  anchorElement Tooltip anchor element.
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen(delay: number, anchorElement: HTMLElement | null): boolean {
    const timer = useRef<number>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!anchorElement) {
            return undefined;
        }
        const open = () => {
            timer.current = setTimeout(() => {
                setIsOpen(true);
            }, delay) as any;
        };
        const close = () => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = undefined;
            }
            setIsOpen(false);
        };
        const handleEscapeKeyPressed = onEscapePressed(close);

        anchorElement.addEventListener('mouseenter', open);
        anchorElement.addEventListener('focusin', open);
        anchorElement.addEventListener('mouseleave', close);
        anchorElement.addEventListener('focusout', close);
        anchorElement.addEventListener('keydown', handleEscapeKeyPressed);
        return () => {
            anchorElement.removeEventListener('mouseenter', open);
            anchorElement.removeEventListener('focusin', open);
            anchorElement.removeEventListener('mouseleave', close);
            anchorElement.removeEventListener('focusout', close);
            anchorElement.removeEventListener('keydown', handleEscapeKeyPressed);

            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [anchorElement, delay, timer]);

    return isOpen;
}
