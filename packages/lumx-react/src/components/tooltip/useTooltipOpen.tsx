import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen({ delay, anchorRef }: { delay: number; anchorRef: RefObject<HTMLElement> }) {
    const timer = useRef<number>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const anchor = anchorRef.current;
        if (!anchor) {
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

        anchor.addEventListener('mouseenter', handleMouseEnter);
        anchor.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            anchor.removeEventListener('mouseenter', handleMouseEnter);
            anchor.removeEventListener('mouseleave', handleMouseLeave);

            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [anchorRef, timer]);

    return isOpen;
}
