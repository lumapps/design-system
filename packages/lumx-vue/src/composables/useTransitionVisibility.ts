import { computed, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from 'vue';

/**
 * Returns true if the component is visible, tracking the opacity transition.
 * Keeps the component mounted during the close animation, then unmounts after the timeout.
 *
 * @param isOpen               Whether the component intends to be visible or not.
 * @param timeout              Duration of the close animation in ms.
 * @param onVisibilityChange   Callback called when the visibility changes.
 * @return ComputedRef<boolean> true if the component should be rendered (open or animating closed)
 */
export function useTransitionVisibility(
    isOpen: Ref<boolean>,
    timeout: number,
    onVisibilityChange?: Ref<((isVisible: boolean) => void) | undefined>,
): ComputedRef<boolean> {
    const isStillVisible = ref(isOpen.value);
    let timer: ReturnType<typeof setTimeout> | undefined;

    watch(
        isOpen,
        (open) => {
            if (open) {
                clearTimeout(timer);
                isStillVisible.value = true;
            } else {
                const isReducedMotion =
                    typeof window.matchMedia === 'function' &&
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const hasTransition = typeof window !== 'undefined' && window.TransitionEvent && !isReducedMotion;

                if (!hasTransition) {
                    isStillVisible.value = false;
                } else {
                    timer = setTimeout(() => {
                        isStillVisible.value = false;
                    }, timeout);
                }
            }
        },
        { immediate: false },
    );

    let previousIsVisible = isStillVisible.value;
    watch(isStillVisible, (val) => {
        if (val !== previousIsVisible) {
            previousIsVisible = val;
            onVisibilityChange?.value?.(val);
        }
    });

    onBeforeUnmount(() => {
        clearTimeout(timer);
    });

    return computed(() => isOpen.value || isStillVisible.value);
}
