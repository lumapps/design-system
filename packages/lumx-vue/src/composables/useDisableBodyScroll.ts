import { watch, type Ref } from 'vue';
import { useScrollLock } from '@vueuse/core';

/**
 * Disables body scroll when the dialog is open.
 * Uses @vueuse/core's useScrollLock which sets overflow:hidden on document.body.
 *
 * @param isActive Whether body scroll should be disabled.
 */
export function useDisableBodyScroll(isActive: Ref<boolean>): void {
    const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null);
    watch(isActive, (active) => {
        isLocked.value = active;
    });
}
