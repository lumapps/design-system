import { useCallback, useRef } from 'react';
import { useTooltipContext } from '@lumx/react/components/tooltip/context';
import { getOverflowingText } from '@lumx/core/js/utils/browser/getOverflowingText';

/**
 * Get a function tooltip label that gives the text of the label element only when it overflows.
 *
 * @example
 * const { labelRef, tooltipLabel } = useOverflowTooltipLabel();
 * <Tooltip label={tooltipLabel}><Text ref={labelRef} truncate>{text}</Text></Tooltip>
 */
export const useOverflowTooltipLabel = () => {
    const parentTooltip = useTooltipContext();
    const labelRef = useRef<HTMLElement | null>(null);

    const tooltipLabel = useCallback(
        () => (parentTooltip ? undefined : getOverflowingText(labelRef.current)),
        [parentTooltip],
    );

    return { labelRef, tooltipLabel };
};
