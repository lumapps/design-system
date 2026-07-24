import { useCallback, useRef } from 'react';
// `use-sync-external-store` is a devDependency on purpose: rollup inlines it into the built lib
// (see rollup.config.mjs `external`), so consumers don't need to install it.
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import type { ComboboxEventMap } from '@lumx/core/js/components/Combobox/types';

import { useComboboxContext } from './ComboboxContext';

/**
 * Hook to subscribe to a combobox event via the handle's subscriber system.
 *
 * Uses `useSyncExternalStore` (shim, for React 17 support) reading the handle's synchronous
 * `getSnapshot` — the correct pattern for an external (non-React) store. It reads the current
 * value during commit, so a consumer doesn't miss changes that happened between its render and its
 * subscription (e.g. options registered by child effects before this consumer subscribed, since
 * `optionsChange` is not replayed on subscribe), and it is tearing-safe under concurrent rendering.
 *
 * The handle dispatches synchronously, so the store update fires within the triggering render/event
 * (inside React's `act` in tests) rather than a deferred microtask. Re-subscribes when the handle
 * changes (e.g. trigger mount/unmount).
 */
export function useComboboxEvent<K extends keyof ComboboxEventMap>(
    event: K,
    initialValue: ComboboxEventMap[K],
): ComboboxEventMap[K] {
    const { handle } = useComboboxContext();

    // Stable fallback used until the event has fired at least once (or while there is no handle).
    const initialValueRef = useRef(initialValue);

    const subscribe = useCallback(
        (onStoreChange: () => void) => handle?.subscribe(event, onStoreChange) ?? (() => undefined),
        [handle, event],
    );

    const getSnapshot = useCallback((): ComboboxEventMap[K] => {
        const value = handle?.getSnapshot(event);
        return value === undefined ? initialValueRef.current : value;
    }, [handle, event]);

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
