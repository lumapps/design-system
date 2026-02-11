import { ref, watch, Ref, onUnmounted } from 'vue';
import { getImageLoadingState, type LoadingState } from '@lumx/core/js/components/Thumbnail';

/**
 * Vue composable for tracking image loading state.
 *
 * @param imageURL - The image URL to track
 * @param imgRef - Reference to the HTMLImageElement
 * @returns Reactive loading state
 */
export function useImageLoad(imageURL: Ref<string>, imgRef: Ref<HTMLImageElement | undefined>): Ref<LoadingState> {
    const state = ref<LoadingState>(getImageLoadingState(imgRef.value));

    // Update function for event listeners
    const update = (event?: Event) => {
        state.value = getImageLoadingState(imgRef.value, event);
    };

    // Update state when changing image URL or DOM reference.
    watch([imageURL, imgRef], () => {
        state.value = getImageLoadingState(imgRef.value);
    });

    // Listen to `load` and `error` event on image
    watch(
        imgRef,
        (newImg, oldImg) => {
            // Remove listeners from old element
            if (oldImg) {
                oldImg.removeEventListener('load', update);
                oldImg.removeEventListener('error', update);
            }

            // Add listeners to new element
            if (newImg) {
                newImg.addEventListener('load', update);
                newImg.addEventListener('error', update);
            }
        },
        { immediate: true },
    );

    // Cleanup on unmount
    onUnmounted(() => {
        const img = imgRef.value;
        if (img) {
            img.removeEventListener('load', update);
            img.removeEventListener('error', update);
        }
    });

    return state;
}
