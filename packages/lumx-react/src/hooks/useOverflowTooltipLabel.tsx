import React from 'react';
import { useTooltipContext } from '@lumx/react/components/tooltip/context';
import { VISUALLY_HIDDEN } from '@lumx/react/constants';

/**
 * Compute a tooltip label based on a label element `innerText` if the text overflows.
 * Updates dynamically on content changes (but not on resize!)
 */
export const useOverflowTooltipLabel = (content: React.ReactNode) => {
    const parentTooltip = useTooltipContext();
    const [tooltipLabel, setTooltipLabel] = React.useState<string | undefined>(undefined);
    const [labelElement, setLabelElement] = React.useState<HTMLElement | null>(null);

    React.useLayoutEffect(() => {
        if (
            // Not inside a tooltip
            !parentTooltip &&
            labelElement &&
            // Not inside a visually hidden
            !labelElement?.closest(`.${VISUALLY_HIDDEN}`) &&
            // Text overflows
            labelElement.offsetWidth < labelElement.scrollWidth
        ) {
            // Set tooltip label
            setTooltipLabel(labelElement.innerText);
        } else {
            setTooltipLabel(undefined);
        }
    }, [labelElement, parentTooltip, content]);

    return { labelRef: setLabelElement, tooltipLabel };
};
