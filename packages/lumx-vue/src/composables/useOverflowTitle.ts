import { onMounted, onUpdated, ref, Ref } from 'vue';
import { getOverflowingText } from '@lumx/core/js/utils/browser/getOverflowingText';
import { useTooltipContext } from '../components/tooltip/context';

/**
 * Compute a native `title` from the `innerText` of a label element when its text overflows.
 * Updates after each render of the component (but not on resize!)
 */
export function useOverflowTitle(labelRef: Ref<HTMLElement | null | undefined>) {
    const title = ref<string | undefined>(undefined);

    // Skip if already inside a tooltip (prevents nested tooltips)
    const isInsideTooltip = useTooltipContext();
    if (isInsideTooltip) {
        return { title };
    }

    const updateLabel = () => {
        title.value = getOverflowingText(labelRef.value);
    };

    onMounted(updateLabel);
    onUpdated(updateLabel);

    return { title };
}
