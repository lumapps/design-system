import { ref, watchEffect, isRef, type Ref } from 'vue';

/**
 * Composable focusing an element when defined and `shouldFocus` becomes `true`.
 * Only focuses once per transition to `true` (one-shot).
 *
 * @param elementRef     Element to focus (or ref to it).
 * @param shouldFocusRef Boolean flag to trigger the focus (or ref to it).
 */
export function useFocus(
    elementRef: Ref<HTMLElement | null | undefined> | HTMLElement | null | undefined,
    shouldFocusRef: Ref<boolean> | boolean = true,
): void {
    const wasFocused = ref(false);

    watchEffect(() => {
        const element = isRef(elementRef) ? elementRef.value : elementRef;
        const shouldFocus = isRef(shouldFocusRef) ? shouldFocusRef.value : shouldFocusRef;

        if (shouldFocus && !wasFocused.value && element) {
            element.focus();
            wasFocused.value = true;
        }
        if (!shouldFocus) {
            wasFocused.value = false;
        }
    });
}
