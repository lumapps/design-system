import { ref, Ref, watch } from 'vue';
import { useMutationObserver, useResizeObserver } from '@vueuse/core';
import { classNames } from '@lumx/core/js/utils';

/**
 * Compute a tooltip label based on a label element `innerText` if the text overflows.
 */
export function useOverflowTooltipLabel(labelRef: Ref<HTMLElement | null | undefined>) {
    const tooltipLabel = ref<string | undefined>(undefined);

    const updateLabel = () => {
        const labelElement = labelRef.value;
        if (
            labelElement &&
            !labelElement.closest(`.${classNames.visuallyHidden()}`) &&
            labelElement.offsetWidth < labelElement.scrollWidth
        ) {
            tooltipLabel.value = labelElement.innerText;
        } else {
            tooltipLabel.value = undefined;
        }
    };

    useMutationObserver(labelRef, updateLabel, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
    });

    useResizeObserver(labelRef, updateLabel);

    watch(labelRef, updateLabel, { immediate: true });

    return { tooltipLabel };
}
