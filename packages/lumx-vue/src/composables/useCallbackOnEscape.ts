import { watchEffect, isRef, type Ref, onUnmounted } from 'vue';
import { onEscapePressed } from '@lumx/core/js/utils/events';
import { makeListenerTowerContext, type Listener } from '@lumx/core/js/utils/function/listenerTower';

const LISTENERS = makeListenerTowerContext();

/**
 * Register a global listener on 'Escape' key pressed.
 *
 * If multiple listeners are registered, only the last one is maintained. When a listener is unregistered, the previous
 * one gets activated again.
 *
 * Supports both reactive refs and static values for callback and closeOnEscape.
 *
 * @param callbackRef      Callback (or ref to callback)
 * @param closeOnEscapeRef Disables the hook when false (or ref to boolean)
 */
export function useCallbackOnEscape(
    callbackRef: Ref<(() => void) | undefined> | (() => void) | undefined,
    closeOnEscapeRef: Ref<boolean> | boolean = true,
) {
    let listener: Listener | undefined;

    watchEffect((onCleanup) => {
        const callback = isRef(callbackRef) ? callbackRef.value : callbackRef;
        const closeOnEscape = isRef(closeOnEscapeRef) ? closeOnEscapeRef.value : closeOnEscapeRef;

        if (!closeOnEscape || !callback) return;

        const onKeyDown = onEscapePressed(() => callback());

        const newListener: Listener = {
            enable: () => document.body.addEventListener('keydown', onKeyDown),
            disable: () => document.body.removeEventListener('keydown', onKeyDown),
        };

        LISTENERS.register(newListener);
        listener = newListener;

        onCleanup(() => {
            LISTENERS.unregister(newListener);
            listener = undefined;
        });
    });

    onUnmounted(() => {
        if (listener) {
            LISTENERS.unregister(listener);
            listener = undefined;
        }
    });
}
