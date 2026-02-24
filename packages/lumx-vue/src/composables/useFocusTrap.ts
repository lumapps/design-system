import { watchEffect, isRef, onUnmounted, type Ref } from 'vue';
import { getFirstAndLastFocusable } from '@lumx/core/js/utils/focus/getFirstAndLastFocusable';
import { makeListenerTowerContext, type Listener } from '@lumx/core/js/utils/function/listenerTower';

const FOCUS_TRAPS = makeListenerTowerContext();

/**
 * Trap 'Tab' focus switch inside the `focusZoneElement`.
 *
 * If multiple focus traps are activated, only the last one is maintained and when a focus trap closes, the previous one
 * gets activated again.
 *
 * @param focusZoneElementRef The element in which to trap the focus (or ref to it). Falsy disables the trap.
 * @param focusElementRef     The element to focus when the focus trap is activated (or ref to it).
 */
export function useFocusTrap(
    focusZoneElementRef: Ref<HTMLElement | null | undefined | false> | HTMLElement | null | undefined | false,
    focusElementRef?: Ref<HTMLElement | null | undefined> | HTMLElement | null | undefined,
): void {
    let currentTrap: Listener | undefined;

    watchEffect((onCleanup) => {
        const focusZoneElement = isRef(focusZoneElementRef) ? focusZoneElementRef.value : focusZoneElementRef;
        const focusElement = isRef(focusElementRef) ? focusElementRef.value : focusElementRef;

        if (!focusZoneElement) return;

        // Use the shadow root as focusZoneElement when available
        const focusZoneElementOrShadowRoot = (focusZoneElement as HTMLElement).shadowRoot || focusZoneElement;

        // Trap 'Tab' key down focus switch into the focus zone.
        const trapTabFocusInFocusZone = (evt: KeyboardEvent) => {
            const { key } = evt;
            if (key !== 'Tab') return;

            const focusable = getFirstAndLastFocusable(focusZoneElementOrShadowRoot as HTMLElement);

            // Prevent focus switch if no focusable available.
            if (!focusable.first) {
                evt.preventDefault();
                return;
            }

            const activeElement = (focusZoneElement as HTMLElement).shadowRoot
                ? (focusZoneElement as HTMLElement).shadowRoot!.activeElement
                : document.activeElement;

            if (
                // No previous focus
                !activeElement ||
                // Previous focus is at the end of the focus zone.
                (!evt.shiftKey && activeElement === focusable.last) ||
                // Previous focus is outside the focus zone
                !focusZoneElementOrShadowRoot.contains(activeElement)
            ) {
                focusable.first.focus();
                evt.preventDefault();
                return;
            }

            if (
                // Focus order reversed
                evt.shiftKey &&
                // Previous focus is at the start of the focus zone.
                activeElement === focusable.first
            ) {
                focusable.last!.focus();
                evt.preventDefault();
            }
        };

        const focusTrap: Listener = {
            enable: () => document.body.addEventListener('keydown', trapTabFocusInFocusZone),
            disable: () => document.body.removeEventListener('keydown', trapTabFocusInFocusZone),
        };

        // SETUP:
        if (focusElement && focusZoneElementOrShadowRoot.contains(focusElement)) {
            // Focus the given element.
            focusElement.focus({ preventScroll: true });
        } else {
            // Focus the first focusable element in the zone.
            getFirstAndLastFocusable(focusZoneElementOrShadowRoot as HTMLElement).first?.focus({ preventScroll: true });
        }
        FOCUS_TRAPS.register(focusTrap);
        currentTrap = focusTrap;

        onCleanup(() => {
            FOCUS_TRAPS.unregister(focusTrap);
            currentTrap = undefined;
        });
    });

    onUnmounted(() => {
        if (currentTrap) {
            FOCUS_TRAPS.unregister(currentTrap);
            currentTrap = undefined;
        }
    });
}
