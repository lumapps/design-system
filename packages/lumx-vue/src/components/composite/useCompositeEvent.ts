import { type Ref, ref } from 'vue';
import type { CompositeEventMap, CompositeEventSource } from '@lumx/core/js/components/Composite/types';
import { useWatchDisposable } from '../../composables/useWatchDisposable';

/**
 * Subscribe to an event of a handle (composite or combobox). Re-subscribes when the handle changes,
 * then starts from the new handle snapshot (or `initialValue` while there is no handle or until the
 * event has fired at least once), so it never keeps the value of the previous handle.
 * `optionsChange` bursts are coalesced into a single deferred update.
 */
export function useHandleEvent<M, K extends keyof M>(
    handle: Readonly<Ref<CompositeEventSource<M> | null>>,
    event: K,
    initialValue: M[K],
): Ref<M[K]> {
    const value = ref(initialValue) as Ref<M[K]>;

    useWatchDisposable(handle, (h) => {
        const snapshot = h?.getSnapshot(event);
        value.value = snapshot === undefined ? initialValue : snapshot;
        if (!h) return undefined;

        // Discrete events (open, loadingChange, …) apply synchronously.
        if (event !== 'optionsChange') {
            return h.subscribe(event, (v) => {
                value.value = v;
            });
        }

        // Coalesce a burst of optionsChange notifications into a single deferred update.
        let scheduled = false;
        let disposed = false;
        let latest = value.value;
        const unsubscribe = h.subscribe(event, (v) => {
            latest = v;
            if (!scheduled) {
                scheduled = true;
                queueMicrotask(() => {
                    scheduled = false;
                    if (!disposed) value.value = latest;
                });
            }
        });
        return () => {
            disposed = true;
            unsubscribe();
        };
    });

    return value;
}

/** Subscribe to a composite handle event (see {@link useHandleEvent}). */
export function useCompositeEvent<K extends keyof CompositeEventMap>(
    handle: Readonly<Ref<CompositeEventSource<CompositeEventMap> | null>>,
    event: K,
    initialValue: CompositeEventMap[K],
): Ref<CompositeEventMap[K]> {
    return useHandleEvent(handle, event, initialValue);
}
