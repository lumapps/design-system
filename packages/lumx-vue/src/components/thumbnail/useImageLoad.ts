import { ref, watch, onBeforeUnmount, Ref } from 'vue';
import { getImageLoadingState } from '@lumx/core/js/components/Thumbnail';
import { type LoadingState } from '@lumx/core/js/components/Thumbnail/types';

/**
 * Vue composable to track image loading state.
 *
 * @param imageURL - The URL of the image to track
 * @param imgRef - Reference to the HTML image element
 * @returns The current loading state ('hasError', 'isLoading', or 'isLoaded')
 */
export function useImageLoad(imageURL: Ref<string>, imgRef: Ref<HTMLImageElement | undefined>): Ref<LoadingState> {
    const state = ref<LoadingState>(getImageLoadingState(imgRef.value));

    // Update state when changing image URL or DOM reference.
    watch(
        [imageURL, imgRef],
        () => {
            state.value = getImageLoadingState(imgRef.value);
        },
        { immediate: true },
    );

    const update = (event?: Event) => {
        if (imgRef.value) {
            state.value = getImageLoadingState(imgRef.value, event);
        }
    };

    // Listen to `load` and `error` event on image
    watch(
        imgRef,
        (img, oldImg) => {
            // Remove listeners from old image
            if (oldImg) {
                oldImg.removeEventListener('load', update);
                oldImg.removeEventListener('error', update);
            }

            // Add listeners to new image
            if (img) {
                img.addEventListener('load', update);
                img.addEventListener('error', update);
            }
        },
        { immediate: true },
    );

    // Cleanup on unmount
    onBeforeUnmount(() => {
        if (imgRef.value) {
            imgRef.value.removeEventListener('load', update);
            imgRef.value.removeEventListener('error', update);
        }
    });

    return state;
}
