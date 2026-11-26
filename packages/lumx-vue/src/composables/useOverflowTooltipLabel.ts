import { shallowRef, type ComponentPublicInstance } from 'vue';
import { getOverflowingText } from '@lumx/core/js/utils/browser/getOverflowingText';
import { useTooltipContext } from '../components/tooltip/context';

/**
 * Get a function tooltip label that gives the text of the label element only when it overflows.
 *
 * @example
 * const { labelRef, tooltipLabel } = useOverflowTooltipLabel();
 * <Tooltip label={tooltipLabel}><Text ref={labelRef} truncate>{text}</Text></Tooltip>
 */
export function useOverflowTooltipLabel() {
    const isInsideTooltip = useTooltipContext();
    const labelRef = shallowRef<HTMLElement | ComponentPublicInstance | null>(null);

    const tooltipLabel = () => {
        if (isInsideTooltip) return undefined;
        const value = labelRef.value;
        const element = value && '$el' in value ? (value.$el as HTMLElement) : value;
        return getOverflowingText(element);
    };

    return { labelRef, tooltipLabel };
}
