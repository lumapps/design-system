import React from 'react';
import { useTooltipContext } from '@lumx/react/components/tooltip/context';

/**
 * Compute a tooltip label based on a label element `innerText` if the text overflows.
 *
 * Warning: only works on first render, does not update on label element resize.
 */
export const useOverflowTooltipLabel = () => {
    const parentTooltip = useTooltipContext();
    const [tooltipLabel, setTooltipLabel] = React.useState<string | undefined>(undefined);
    const labelRef = React.useCallback(
        (labelElement: HTMLElement | null) => {
            if (!labelElement || !!parentTooltip) {
                // Skip if label element is unknown
                // Skip if the parent has a tooltip
                return;
            }

            // Label overflowing
            if (labelElement.offsetWidth < labelElement.scrollWidth) {
                setTooltipLabel(labelElement.innerText);
            }
        },
        [parentTooltip],
    );

    return { labelRef, tooltipLabel };
};
