import { ref, computed, watch, nextTick, Ref, ComputedRef, CSSProperties } from 'vue';
import { getImageSize, calculateFocusPointStyle } from '@lumx/core/js/components/Thumbnail';
import { RectSize } from '@lumx/core/js/types';
import { AspectRatio } from '@lumx/core/js/constants';
import { FocusPoint } from '@lumx/core/js/components/Thumbnail/types';

interface FocusPointStyleParams {
    image: Ref<string>;
    aspectRatio: Ref<AspectRatio | undefined>;
    focusPoint: Ref<FocusPoint | undefined>;
    width: Ref<number | undefined>;
    height: Ref<number | undefined>;
    element: Ref<HTMLImageElement | undefined>;
    isLoaded: Ref<boolean>;
}

/**
 * Vue composable to compute CSS properties for focus point positioning.
 *
 * @param params - Focus point style parameters
 * @returns Computed CSS properties for the image
 */
export function useFocusPointStyle(params: FocusPointStyleParams): ComputedRef<CSSProperties> {
    const { image, aspectRatio, focusPoint, width, height, element, isLoaded } = params;

    // Get natural image size from imgProps or img element.
    const imageSize = computed<RectSize | undefined>(() =>
        getImageSize({
            image: image.value,
            aspectRatio: aspectRatio.value,
            focusPoint: focusPoint.value,
            width: width.value,
            height: height.value,
            element: element.value,
            isLoaded: isLoaded.value,
        }),
    );

    // Get container size (dependent on imageSize).
    const containerSize = ref<RectSize | undefined>(undefined);

    const updateContainerSize = () => {
        const cWidth = element.value?.offsetWidth;
        const cHeight = element.value?.offsetHeight;
        if (cWidth && cHeight) {
            // Update only if needed.
            const oldContainerSize = containerSize.value;
            if (oldContainerSize?.width !== cWidth || oldContainerSize?.height !== cHeight) {
                containerSize.value = { width: cWidth, height: cHeight };
            }
        } else if (imageSize.value) {
            // Wait for a render (in case the container size is dependent on the image size).
            requestAnimationFrame(updateContainerSize);
        }
    };

    // Watch for changes that affect container size
    watch(
        [() => element.value?.offsetWidth, () => element.value?.offsetHeight, imageSize],
        () => {
            nextTick(updateContainerSize);
        },
        { immediate: true },
    );

    // Compute style.
    const style = computed(
        () =>
            calculateFocusPointStyle({
                image: image.value,
                aspectRatio: aspectRatio.value,
                focusPoint: focusPoint.value,
                element: element.value,
                imageSize: imageSize.value,
                containerSize: containerSize.value,
            }) as CSSProperties,
    );

    return style;
}
