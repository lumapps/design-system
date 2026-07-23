import { type Ref, ref } from 'vue';

import type { ComboboxEventMap } from '@lumx/core/js/components/Combobox/types';

import { useWatchDisposable } from '../../../composables/useWatchDisposable';
import { useComboboxContext } from './ComboboxContext';

/**
 * Composable to subscribe to a combobox event via the handle's subscriber system.
 *
 * `optionsChange` updates are coalesced into a microtask. Mounting a large option list fires one
 * `optionsChange` per option registration; applying each synchronously makes a consumer that both
 * reads the option count and (re)mounts options — e.g. `Combobox.Input` — mutate its own render
 * dependency, tripping Vue's recursive-update guard. Coalescing applies only the final value, once
 * per tick. Other events are applied synchronously.
 *
 * (React does not need this: it batches synchronous store updates itself, and coalescing there
 * would defer the update into a microtask that fires outside `act` in consumers' unit tests.)
 *
 * Re-subscribes when the handle changes (e.g. trigger mount/unmount).
 */
export function useComboboxEvent<K extends keyof ComboboxEventMap>(
    event: K,
    initialValue: ComboboxEventMap[K],
): Ref<ComboboxEventMap[K]> {
    const { handle } = useComboboxContext();
    const value = ref(initialValue) as Ref<ComboboxEventMap[K]>;

    useWatchDisposable(handle, (h) => {
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
