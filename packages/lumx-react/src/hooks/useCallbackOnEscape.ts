import { DOCUMENT } from '@lumx/react/constants';
import { Callback } from '@lumx/react/utils/type';
import { onEscapePressed } from '@lumx/react/utils/event';
import { useEffect } from 'react';
import { Listener, makeListenerTowerContext } from '@lumx/react/utils/function/makeListenerTowerContext';

const LISTENERS = makeListenerTowerContext();

/**
 * Register a global listener on 'Escape' key pressed.
 *
 * If multiple listener are registered, only the last one is maintained. When a listener is unregistered, the previous
 * one gets activated again.
 *
 * @param callback      Callback
 * @param closeOnEscape Disables the hook when false
 */
export function useCallbackOnEscape(callback: Callback | undefined, closeOnEscape = true) {
    useEffect(() => {
        const rootElement = DOCUMENT?.body;
        if (!closeOnEscape || !callback || !rootElement) {
            return undefined;
        }
        const onKeyDown = onEscapePressed(callback);

        const listener: Listener = {
            enable: () => rootElement.addEventListener('keydown', onKeyDown),
            disable: () => rootElement.removeEventListener('keydown', onKeyDown),
        };

        LISTENERS.register(listener);
        return () => LISTENERS.unregister(listener);
    }, [callback, closeOnEscape]);
}
