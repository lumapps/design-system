import last from 'lodash/last';
import pull from 'lodash/pull';

export type Listener = { enable(): void; disable(): void };

/**
 * Keep track of listeners, only the last registered listener gets activated at any point (previously registered
 * listener are disabled).
 * When a listener gets unregistered, the previously registered listener gets enabled again.
 */
export function makeListenerTowerContext() {
    const LISTENERS: Listener[] = [];

    return {
        register(listener: Listener) {
            // Disable previous listener.
            last(LISTENERS)?.disable();
            // Keep track of current listener.
            LISTENERS.push(listener);
            // Enable current listener.
            listener.enable();
        },
        unregister(listener: Listener) {
            // Disable current listener.
            listener.disable();
            // Remove current listener.
            pull(LISTENERS, listener);
            // Enable previous listener.
            last(LISTENERS)?.enable();
        },
    };
}
