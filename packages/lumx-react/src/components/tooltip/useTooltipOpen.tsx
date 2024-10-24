import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { browserDoesNotSupportHover } from '@lumx/react/utils/browserDoesNotSupportHover';
import { IS_BROWSER, TOOLTIP_HOVER_DELAY, TOOLTIP_LONG_PRESS_DELAY } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { isFocusVisible } from '@lumx/react/utils/isFocusVisible';

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

    // Global close on escape
    const [closeCallback, setCloseCallback] = useState<undefined | (() => void)>(undefined);
    useCallbackOnEscape(isOpen ? closeCallback : undefined);

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
            const update = () => {
                setIsOpen(!!shouldOpen);
            };
            // Skip timeout in fake browsers
            if (!IS_BROWSER) update();
            else timer = setTimeout(update, duration) as any;
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
        const getClose = (overrideDelay = closeDelay) => {
            if (!shouldOpen && !timer) return;
            shouldOpen = false;
            deferUpdate(overrideDelay);
        };
        const close = () => getClose(closeDelay);
        const closeImmediately = () => getClose(0);
        setCloseCallback(() => closeImmediately);

        // Adapt event to browsers with or without `hover` support.
        const events: Array<[Node, Event['type'], any]> = [];
        if (hoverNotSupported) {
            /**
             * Handle touchend event
             * If end comes before the open delay => cancel tooltip (close immediate).
             * Else if end comes after the open delay => tooltip takes priority, the anchor's default touch end event is prevented.
             */
            const longPressEnd = (evt: Event) => {
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

            events.push(
                [anchorElement, hasTouch ? 'touchstart' : 'mousedown', open],
                [anchorElement, hasTouch ? 'touchend' : 'mouseup', longPressEnd],
            );
        } else {
            events.push(
                [anchorElement, 'mouseenter', open],
                [anchorElement, 'mouseleave', close],
                [anchorElement, 'mouseup', closeImmediately],
            );

            onPopperMount.current = (popperElement: HTMLElement | null) => {
                if (!popperElement) return;
                // Popper element hover
                popperElement.addEventListener('mouseenter', open);
                popperElement.addEventListener('mouseleave', close);
                // Add to event list to remove on unmount
                events.push([popperElement, 'mouseenter', open], [popperElement, 'mouseleave', close]);
            };
        }

        // Events always applied no matter the browser:.
        events.push(
            // Open on focus (only if focus is visible).
            [
                anchorElement,
                'focusin',
                (e: Event) => {
                    // Skip if focus is not visible
                    if (!isFocusVisible(e.target as HTMLElement)) return;
                    open();
                },
            ],
            // Close on lost focus.
            [anchorElement, 'focusout', closeImmediately],
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

    return { isOpen, onPopperMount: onPopperMount.current };
}
