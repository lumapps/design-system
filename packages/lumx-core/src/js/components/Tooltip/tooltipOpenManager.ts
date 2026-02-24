import { IS_BROWSER, TOOLTIP_HOVER_DELAY, TOOLTIP_LONG_PRESS_DELAY } from '../../constants';
import { isFocusVisible } from '../../utils/browser/isFocusVisible';
import { isHoverNotSupported } from '../../utils/browser/isHoverNotSupported';

export interface TooltipOpenManagerOptions {
    /** Delay in millisecond to display the tooltip. */
    delay?: number;
    /** Callback to update the open state. */
    onStateChange: (isOpen: boolean) => void;
}

export interface TooltipOpenManager {
    /** Attach event listeners to the anchor element. */
    attachAnchor(anchorElement: HTMLElement): void;
    /** Attach event listeners to the popper element (for hover support). */
    attachPopper(popperElement: HTMLElement | null): void;
    /** Close the tooltip immediately (for escape key integration). */
    close(): void;
    /** Destroy the manager, clearing all timers and detaching events. */
    destroy(): void;
}

/**
 * Framework-agnostic open/close state machine for tooltip.
 * Manages hover, touch, focus, timers, and escape key behavior.
 */
export function createTooltipOpenManager(options: TooltipOpenManagerOptions): TooltipOpenManager {
    const { delay, onStateChange } = options;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let openStartTime: number | undefined;
    let shouldOpen: boolean | undefined;
    let anchorController: AbortController | undefined;
    let popperController: AbortController | undefined;

    // Run timer to defer updating the isOpen state.
    const deferUpdate = (duration: number) => {
        if (timer) clearTimeout(timer);
        const update = () => {
            onStateChange(!!shouldOpen);
        };
        // Skip timeout in fake browsers
        if (!IS_BROWSER) update();
        else timer = setTimeout(update, duration);
    };

    const hoverNotSupported = isHoverNotSupported();
    const hasTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

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
    const getClose = (overrideDelay: number) => {
        if (!shouldOpen && !timer) return;
        shouldOpen = false;
        deferUpdate(overrideDelay);
    };
    const close = () => getClose(closeDelay);
    const closeImmediately = () => getClose(0);

    return {
        attachAnchor(anchorElement: HTMLElement): void {
            anchorController = new AbortController();
            const { signal } = anchorController;

            if (hoverNotSupported) {
                /**
                 * Handle touchend event.
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

                anchorElement.addEventListener(hasTouch ? 'touchstart' : 'mousedown', open, { signal });
                anchorElement.addEventListener(hasTouch ? 'touchend' : 'mouseup', longPressEnd, { signal });
            } else {
                anchorElement.addEventListener('mouseenter', open, { signal });
                anchorElement.addEventListener('mouseleave', close, { signal });
                anchorElement.addEventListener('mouseup', closeImmediately, { signal });
            }

            // Events always applied no matter the browser:
            // Open on focus (only if focus is visible).
            anchorElement.addEventListener(
                'focusin',
                (e: Event) => {
                    // Skip if focus is not visible
                    if (!isFocusVisible(e.target as HTMLElement)) return;
                    open();
                },
                { signal },
            );
            // Close on lost focus.
            anchorElement.addEventListener('focusout', closeImmediately, { signal });
        },

        attachPopper(popperElement: HTMLElement | null): void {
            popperController?.abort();
            if (!popperElement || hoverNotSupported) return;
            popperController = new AbortController();
            const { signal } = popperController;
            // Popper element hover
            popperElement.addEventListener('mouseenter', open, { signal });
            popperElement.addEventListener('mouseleave', close, { signal });
        },

        close(): void {
            closeImmediately();
        },

        destroy(): void {
            if (timer) clearTimeout(timer);
            anchorController?.abort();
            popperController?.abort();
        },
    };
}
