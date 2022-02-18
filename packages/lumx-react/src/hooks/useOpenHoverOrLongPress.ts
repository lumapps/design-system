import { onEscapePressed } from '@lumx/react/utils';
import { useEffect, useState } from 'react';
import { browserDoesNotSupportHover } from '@lumx/react/utils/browserDoesNotSupportHover';

interface OpenCloseConfig {
    openDelay: number;
    closeDelay: number;
}

interface Config {
    hover: OpenCloseConfig;
    longPress: OpenCloseConfig;
}

export const DEFAULT_CONFIG: Config = {
    hover: {
        openDelay: 500,
        closeDelay: 0,
    },
    longPress: {
        openDelay: 250,
        closeDelay: 3000,
    },
};

/**
 * Hook controlling an open/close action on hover on device supporting pointer hover
 * and on long press on device not supporting pointer hover.
 *
 * @param  anchorElement Anchor element on which the hover or longPress is watched.
 * @param  config        Open/close delay configuration.
 * @return true/false boolean.
 */
export function useOpenHoverOrLongPress(
    anchorElement: HTMLElement | null,
    config: { hover?: Partial<OpenCloseConfig>; longPress?: Partial<OpenCloseConfig> } = {},
): boolean {
    const [isOpen, setIsOpen] = useState(false);
    const activation = browserDoesNotSupportHover() ? 'longPress' : 'hover';
    const { openDelay: defaultOpenDelay, closeDelay: defaultCloseDelay } = DEFAULT_CONFIG[activation];
    const { openDelay = defaultOpenDelay, closeDelay = defaultCloseDelay } = config?.[activation] || {};

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

        const hasTouch = 'ontouchstart' in window;

        // Open (or/and cancel closing).
        const open = () => {
            if (shouldOpen && !timer) return;
            shouldOpen = true;
            openStartTime = Date.now();
            deferUpdate(openDelay);
        };

        // Close or cancel opening
        const close = (overrideDelay = closeDelay) => {
            if (!shouldOpen && !timer) return;
            shouldOpen = false;
            deferUpdate(overrideDelay);
        };
        const closeImmediately = () => close(0);

        /**
         * Handle touchend event
         * If `touchend` comes before the open delay => cancel open (close immediate).
         * Else if `touchend` comes after the open delay => open takes priority, the anchor's default touch end event is prevented.
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

        const events: Array<[Node, Event['type'], any]> = [];

        // Long press activation.
        if (activation === 'longPress') {
            events.push(
                [anchorElement, hasTouch ? 'touchstart' : 'mousedown', open],
                [anchorElement, hasTouch ? 'touchend' : 'mouseup', touchEnd],
            );
        }

        // Hover activation.
        if (activation === 'hover') {
            events.push(
                [anchorElement, 'mouseenter', open],
                [anchorElement, 'mouseleave', close],
                [anchorElement, 'mouseup', closeImmediately],
            );
        }

        // Events always applied no matter the browser:
        events.push(
            // Open on focus.
            [anchorElement, 'focusin', open],
            // Close on lost focus.
            [anchorElement, 'focusout', closeImmediately],
            // Close on ESC keydown
            [anchorElement, 'keydown', onEscapePressed(closeImmediately)],
        );

        // Attach events
        for (const [node, eventType, evenHandler] of events) {
            node.addEventListener(eventType, evenHandler);
        }
        return () => {
            // Detach events.
            for (const [node, eventType, evenHandler] of events) {
                node.removeEventListener(eventType, evenHandler);
            }
            closeImmediately();
        };
    }, [activation, anchorElement, closeDelay, openDelay]);

    return isOpen;
}
