import { ref, computed, watch, Ref, type CSSProperties } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { getImageSize, calculateFocusPointStyle } from '@lumx/core/js/components/Thumbnail';
import { RectSize } from '@lumx/core/js/types';
import { AspectRatio } from '@lumx/core/js/constants';
import { FocusPoint } from '@lumx/core/js/components/Thumbnail/types';

export interface UseFocusPointStyleParams {
    /** Image URL */
    image: Ref<string>;
    /** Aspect ratio */
    aspectRatio?: Ref<AspectRatio | undefined>;
    /** Focus point */
    focusPoint?: Ref<FocusPoint | undefined>;
    /** Width from imgProps */
    width?: Ref<number | string | undefined>;
    /** Height from imgProps */
    height?: Ref<number | string | undefined>;
    /** Image element reference */
    element: Ref<HTMLImageElement | undefined>;
    /** Whether image is loaded */
    isLoaded: Ref<boolean>;
}

/**
 * Vue composable for computing CSS properties to apply the focus point.
 *
 * @param params - Focus point style parameters
 * @returns Reactive CSS properties
 */
export function useFocusPointStyle(params: UseFocusPointStyleParams): Ref<CSSProperties> {
    const { image, aspectRatio, focusPoint, width, height, element, isLoaded } = params;

    // Get natural image size from imgProps or img element.
    const imageSize = computed<RectSize | undefined>(() => {
        const widthValue = width?.value;
        const heightValue = height?.value;

        return getImageSize({
            image: image.value,
            aspectRatio: aspectRatio?.value,
            focusPoint: focusPoint?.value,
            width: typeof widthValue === 'number' ? widthValue : undefined,
            height: typeof heightValue === 'number' ? heightValue : undefined,
            element: element.value,
            isLoaded: isLoaded.value,
        });
    });

    // Get container size (dependent on imageSize).
    const containerSize = ref<RectSize | undefined>(undefined);

    const updateContainerSize = () => {
        const img = element.value;
        const cWidth = img?.offsetWidth;
        const cHeight = img?.offsetHeight;

        if (cWidth && cHeight) {
            // Update only if needed.
            if (containerSize.value?.width !== cWidth || containerSize.value?.height !== cHeight) {
                containerSize.value = { width: cWidth, height: cHeight };
            }
        } else if (imageSize.value) {
            // Wait for a render (in case the container size is dependent on the image size).
            requestAnimationFrame(updateContainerSize);
        }
    };

    // Watch for changes that require container size update
    watch([element, imageSize], updateContainerSize, { immediate: true });

    // Use resize observer to track container size changes
    useResizeObserver(element, updateContainerSize);

    // Compute style.
    const style = computed(() => {
        const reactStyle = calculateFocusPointStyle({
            image: image.value,
            aspectRatio: aspectRatio?.value,
            focusPoint: focusPoint?.value,
            element: element.value,
            imageSize: imageSize.value,
            containerSize: containerSize.value,
        });
        // Cast React.CSSProperties to Vue's CSSProperties
        return reactStyle as CSSProperties;
    });

    return style;
}
