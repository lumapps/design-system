import { RefObject, useEffect, useState } from 'react';

/**
 * Hook controlling tooltip visibillity using mouse hover the anchor and delay.
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen({ delay, anchorRef }: { delay: number; anchorRef: RefObject<HTMLElement> }) {
    const [timer, setTimer] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const anchor = anchorRef.current;
        if (!anchor) {
            return;
        }
        const handleMouseEnter = () => {
            const id: any = setTimeout(() => {
                setIsOpen(true);
            }, delay);
            setTimer(id);
        };

        const handleMouseLeave = () => {
            if (timer) {
                clearTimeout(timer);
                setTimer(0);
            }
            setIsOpen(false);
        };

        anchor.addEventListener('mouseenter', handleMouseEnter);
        anchor.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            anchor.removeEventListener('mouseenter', handleMouseEnter);
            anchor.removeEventListener('mouseleave', handleMouseLeave);

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [anchorRef, timer]);

    return isOpen;
}
