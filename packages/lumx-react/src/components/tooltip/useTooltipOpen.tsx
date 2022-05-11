import { onEscapePressed } from '@lumx/react/utils';
import { useEffect, useState } from 'react';
import { browserDoesNotSupportHover } from '@lumx/react/utils/browserDoesNotSupportHover';
import { TOOLTIP_HOVER_DELAY, TOOLTIP_LONG_PRESS_DELAY } from '@lumx/react/constants';

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param  delay         Delay in millisecond to display the tooltip.
 * @param  anchorElement Tooltip anchor element.
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen(delay: number | undefined, anchorElement: HTMLElement | null): boolean {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!anchorElement) {
            return undefined;
        }
        let timer: number | undefined;
        let openStartTime: number | undefined;
        let shouldOpen: boolean | undefined;

        // Run timer to defer updating the isOpen state.
        const deferUpdate = (duration: number) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                setIsOpen(!!shouldOpen);
            }, duration) as any;
        };

        const hoverNotSupported = browserDoesNotSupportHover();
        const hasTouch = 'ontouchstart' in window;

        // Adapt open/close delay
        const openDelay = delay || (hoverNotSupported ? TOOLTIP_LONG_PRESS_DELAY.open : TOOLTIP_HOVER_DELAY.open);
        const closeDelay = hoverNotSupported ? TOOLTIP_LONG_PRESS_DELAY.close : TOOLTIP_HOVER_DELAY.close;

        // Open (or/and cancel closing) of tooltip.
        const open = () => {
            if (shouldOpen && !timer) return;
            shouldOpen = true;
            openStartTime = Date.now();
            deferUpdate(openDelay);
        };

        // Close or cancel opening of tooltip
        const close = (overrideDelay = closeDelay) => {
            if (!shouldOpen && !timer) return;
            shouldOpen = false;
            deferUpdate(overrideDelay);
        };
        const closeImmediately = () => close(0);

        /**
         * Handle touchend event
         * If `touchend` comes before the open delay => cancel tooltip (close immediate).
         * Else if `touchend` comes after the open delay => tooltip takes priority, the anchor's default touch end event is prevented.
         */
        const touchEnd = (evt: Event) => {
            if (!openStartTime) return;
            if (Date.now() - openStartTime >= openDelay) {
                // Tooltip take priority, event prevented.
                evt.stopPropagation();
                evt.preventDefault();
                anchorElement.focus();
                // Close with delay.
                close();
            } else {
                // Close immediately.
                closeImmediately();
            }
        };

        // Adapt event to browsers with or without `hover` support.
        const events: Array<[Node, Event['type'], any]> = hoverNotSupported
            ? [
                  [anchorElement, hasTouch ? 'touchstart' : 'mousedown', open],
                  [anchorElement, hasTouch ? 'touchend' : 'mouseup', touchEnd],
              ]
            : [
                  [anchorElement, 'mouseenter', open],
                  [anchorElement, 'mouseleave', close],
                  [anchorElement, 'mouseup', closeImmediately],
              ];

        // Events always applied no matter the browser:.
        events.push(
            // Open on focus.
            [anchorElement, 'focusin', open],
            // Close on lost focus.
            [anchorElement, 'focusout', closeImmediately],
            // Close on ESC keydown
            [anchorElement, 'keydown', onEscapePressed(closeImmediately)],
        );

        // Attach events
        for (const [node, eventType, eventHandler] of events) {
            node.addEventListener(eventType, eventHandler);
        }
        return () => {
            // Clear pending timers.
            if (timer) clearTimeout(timer);

            // Detach events.
            for (const [node, eventType, eventHandler] of events) {
                node.removeEventListener(eventType, eventHandler);
            }
        };
    }, [anchorElement, delay]);

    return isOpen;
}
