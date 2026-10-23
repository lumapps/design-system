import { type Ref, shallowRef } from 'vue';
import type { CompositeEventMap, CompositeEventSource } from '@lumx/core/js/components/Composite/types';
import { useWatchDisposable } from '../../composables/useWatchDisposable';

/**
 * Composite events coalesced into a single deferred update (microtask): mounting a large item list fires one
 * `optionsChange` (and one `stateChange`) per item registration. Applying each notification synchronously makes a
 * consumer that both reads the value and (re)mounts the items mutate its own render dependency, which trips the Vue
 * recursive update guard. The other events are applied synchronously.
 *
 * (React does not need this: it batches synchronous store updates itself, and coalescing there
 * would defer the update into a microtask that fires outside `act` in consumers' unit tests.)
 */
const COALESCED_EVENTS: ReadonlySet<PropertyKey> = new Set<keyof CompositeEventMap>(['optionsChange', 'stateChange']);

/**
 * Subscribe to an event of a handle (a composite handle). Re-subscribes when the handle changes, then starts from
 * the new handle snapshot (or `initialValue` while there is no handle or until the event has fired at least once),
 * so it never keeps the value of the previous handle. An `undefined` notification resets the value to
 * `initialValue` the same way.
 */
export function useCompositeEvent<M extends CompositeEventMap, K extends keyof M>(
    handle: Readonly<Ref<CompositeEventSource<M> | null>>,
    event: K,
    initialValue: M[K],
): Ref<M[K]> {
    // Shallow: the values are replaced, never mutated (and a handle value must not become a reactive proxy).
    const value = shallowRef(initialValue) as Ref<M[K]>;
    const apply = (v: M[K] | undefined) => {
        value.value = v === undefined ? initialValue : v;
    };

    useWatchDisposable(handle, (h) => {
        apply(h?.getSnapshot(event));
        if (!h) return undefined;

        if (!COALESCED_EVENTS.has(event)) return h.subscribe(event, apply);

        let scheduled = false;
        let disposed = false;
        let latest: M[K] | undefined = value.value;
        const unsubscribe = h.subscribe(event, (v) => {
            latest = v;
            if (!scheduled) {
                scheduled = true;
                queueMicrotask(() => {
                    scheduled = false;
                    if (!disposed) apply(latest);
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
