import { DOCUMENT } from '@lumx/react/constants';
import { Callback, onEscapePressed } from '@lumx/react/utils';
import { useEffect } from 'react';
import last from 'lodash/last';
import pull from 'lodash/pull';

type Listener = { enable(): void; disable(): void };

/**
 * List of all listeners.
 */
const LISTENERS: Listener[] = [];

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

        // SETUP:
        // Disable previous listener.
        last(LISTENERS)?.disable();
        // Keep track of current listener.
        LISTENERS.push(listener);
        // Enable current listener.
        listener.enable();

        // TEARDOWN:
        return () => {
            // Disable current listener.
            listener.disable();
            // Remove current listener.
            pull(LISTENERS, listener);
            // Enable previous listener.
            last(LISTENERS)?.enable();
        };
    }, [callback, closeOnEscape]);
}
