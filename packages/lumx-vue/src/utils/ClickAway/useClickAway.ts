import { onBeforeUnmount, watchEffect, type Ref } from 'vue';
import { setupClickAway, type ClickAwayCallback } from '@lumx/core/js/utils/ClickAway';

export interface ClickAwayParameters {
    /**
     * A callback function to call when the user clicks away from the elements.
     */
    callback: ClickAwayCallback;
    /**
     * Elements considered within the click away context (clicking outside them will trigger the click away callback).
     */
    childrenRefs: Ref<Array<Ref<HTMLElement | undefined>>>;
}

/**
 * Listen to clicks away from the given elements and callback the passed in function.
 *
 * Warning: If you need to detect click away on nested Vue portals, please use the `ClickAwayProvider` component.
 */
export function useClickAway({ callback, childrenRefs }: ClickAwayParameters): void {
    let teardown: (() => void) | undefined;

    watchEffect(() => {
        // Clean up previous listener
        teardown?.();

        const getElements = () => {
            const refs = childrenRefs.value;
            if (!refs) return [];
            return refs.map((ref) => ref?.value).filter(Boolean) as HTMLElement[];
        };

        teardown = setupClickAway(getElements, callback);
    });

    onBeforeUnmount(() => {
        teardown?.();
    });
}
