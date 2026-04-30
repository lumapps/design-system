import { isRef, onScopeDispose, watchPostEffect, type Ref } from 'vue';
import { setupFocusTrap } from '@lumx/core/js/utils/focus/setupFocusTrap';

/**
 * Trap 'Tab' focus switch inside the `focusZoneElement`.
 *
 * If multiple focus traps are activated, only the last one is maintained and when a focus trap closes, the previous one
 * gets activated again.
 *
 * If the zone has no focusable descendant, the zone element itself receives focus (with a fallback `tabindex="-1"`).
 *
 * @param focusZoneElementRef The element in which to trap the focus (or ref to it). Falsy disables the trap.
 * @param focusElementRef     The element to focus when the focus trap is activated (or ref to it).
 */
export function useFocusTrap(
    focusZoneElementRef: Ref<HTMLElement | null | undefined | false> | HTMLElement | null | undefined | false,
    focusElementRef?: Ref<HTMLElement | null | undefined> | HTMLElement | null | undefined,
): void {
    let currentController: AbortController | undefined;

    const tearDown = () => {
        if (currentController) {
            currentController.abort();
            currentController = undefined;
        }
    };

    watchPostEffect((onCleanup) => {
        const focusZoneElement = isRef(focusZoneElementRef) ? focusZoneElementRef.value : focusZoneElementRef;
        const focusElement = isRef(focusElementRef) ? focusElementRef.value : focusElementRef;

        if (!focusZoneElement) return;

        const controller = new AbortController();
        currentController = controller;
        setupFocusTrap({ focusZoneElement, focusElement }, controller.signal);

        onCleanup(tearDown);
    });

    onScopeDispose(tearDown);
}
