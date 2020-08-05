import { useEffect, useRef, useState } from 'react';

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param  delay         Delay in millisecond to display the tooltip.
 * @param  anchorElement Tooltip anchor element.
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen(delay: number, anchorElement: HTMLElement | null) {
    const timer = useRef<number>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!anchorElement) {
            return;
        }
        const handleMouseEnter = () => {
            timer.current = setTimeout(() => {
                setIsOpen(true);
            }, delay) as any;
        };

        const handleMouseLeave = () => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = undefined;
            }
            setIsOpen(false);
        };

        anchorElement.addEventListener('mouseenter', handleMouseEnter);
        anchorElement.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            anchorElement.removeEventListener('mouseenter', handleMouseEnter);
            anchorElement.removeEventListener('mouseleave', handleMouseLeave);

            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [anchorElement, timer]);

    return isOpen;
}
