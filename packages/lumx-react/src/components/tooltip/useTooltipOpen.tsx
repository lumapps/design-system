import { Callback, onEscapePressed } from '@lumx/react/utils';
import { useEffect, useRef, useState } from 'react';
import pull from 'lodash/pull';
import debounce from 'lodash/debounce';

type Tooltip = { open: Callback; close: Callback; anchorElement: HTMLElement };

/**
 * This singleton handle a global `mouseover` event listener on the `document` in order to toggle tooltips when
 * entering and leaving their anchor element.
 */
const tooltipMouseToggle = (() => {
    /** List of tooltips to toggle on anchor enter/leave. */
    let tooltips: Array<Tooltip> | undefined;

    /** Global listener added on the document. */
    let globalListener: undefined | ((evt: MouseEvent) => void);

    function addGlobalListener() {
        if (globalListener) return;
        globalListener = debounce((evt) => {
            if (!tooltips || !evt.target) return;
            for (const { open, close, anchorElement } of tooltips) {
                if (anchorElement.contains(evt.target as any)) {
                    open();
                } else {
                    close();
                }
            }
        }, 10);
        document.addEventListener('mouseover', globalListener);
    }

    function removeGlobalListener() {
        if (!globalListener) return;
        document.removeEventListener('mouseover', globalListener);
        globalListener = undefined;
    }

    return {
        addTooltip(tooltip: Tooltip) {
            if (!tooltips) {
                tooltips = [];
                addGlobalListener();
            }
            tooltips.push(tooltip);
        },
        removeTooltip(actions: Tooltip) {
            if (!tooltips) return;
            pull(tooltips, actions);
            if (tooltips.length === 0) {
                removeGlobalListener();
                tooltips = undefined;
            }
        },
    };
})();

/**
 * Hook controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param  delay         Delay in millisecond to display the tooltip.
 * @param  anchorElement Tooltip anchor element.
 * @return whether or not to show the tooltip.
 */
export function useTooltipOpen(delay: number, anchorElement: HTMLElement | null): boolean {
    const timer = useRef<number>();
    const shouldOpen = useRef<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!anchorElement) {
            return undefined;
        }
        const tooltip: Tooltip = {
            anchorElement,
            open() {
                if (!shouldOpen.current) {
                    shouldOpen.current = true;
                    timer.current = setTimeout(() => {
                        setIsOpen(shouldOpen.current);
                    }, delay) as any;
                }
            },
            close() {
                if (timer.current) {
                    clearTimeout(timer.current);
                    timer.current = undefined;
                }
                if (shouldOpen.current) {
                    shouldOpen.current = false;
                    setIsOpen(shouldOpen.current);
                }
            },
        };
        const keydown = onEscapePressed(tooltip.close);

        tooltipMouseToggle.addTooltip(tooltip);
        anchorElement.addEventListener('focusin', tooltip.open);
        anchorElement.addEventListener('focusout', tooltip.close);
        anchorElement.addEventListener('keydown', keydown);
        return () => {
            tooltipMouseToggle.removeTooltip(tooltip);
            anchorElement.removeEventListener('focusin', tooltip.open);
            anchorElement.removeEventListener('focusout', tooltip.close);
            anchorElement.removeEventListener('keydown', keydown);
            tooltip.close();
        };
    }, [anchorElement, delay, timer, shouldOpen]);

    return isOpen;
}
