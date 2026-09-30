import { type Ref, ref } from 'vue';
import type { ListboxEventMap, ListboxHandle } from '@lumx/core/js/components/Listbox/types';
import { useWatchDisposable } from '../../../composables/useWatchDisposable';

/** Minimal event source shape of the listbox handle. */
export interface EventSource {
    subscribe(event: string, callback: (value: unknown) => void): () => void;
}

/**
 * Subscribe to an event of a listbox handle. Re-subscribes when the handle changes.
 * `optionsChange` bursts are coalesced into a single deferred update.
 */
export function useHandleEvent<V>(handle: Readonly<Ref<EventSource | null>>, event: string, initialValue: V): Ref<V> {
    const value = ref(initialValue) as Ref<V>;

    useWatchDisposable(handle, (h) => {
        if (!h) return undefined;

        // Discrete events (open, loadingChange, …) apply synchronously.
        if (event !== 'optionsChange') {
            return h.subscribe(event, (v) => {
                value.value = v as V;
            });
        }

        // Coalesce a burst of optionsChange notifications into a single deferred update.
        let scheduled = false;
        let disposed = false;
        let latest = value.value;
        const unsubscribe = h.subscribe(event, (v) => {
            latest = v as V;
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

/** Subscribe to a listbox handle event. */
export function useListboxEvent<K extends keyof ListboxEventMap>(
    handle: Readonly<Ref<ListboxHandle | null>>,
    event: K,
    initialValue: ListboxEventMap[K],
): Ref<ListboxEventMap[K]> {
    return useHandleEvent(handle as unknown as Readonly<Ref<EventSource | null>>, event, initialValue);
}
