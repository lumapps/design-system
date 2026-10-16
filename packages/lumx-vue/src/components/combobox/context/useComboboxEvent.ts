import type { Ref } from 'vue';
import type { CompositeEventMap, CompositeEventSource } from '@lumx/core/js/components/Composite/types';
import { useComboboxContext } from './ComboboxContext';
import { useCompositeEvent, useHandleEvent } from '../../composite/useCompositeEvent';

/**
 * Composable to subscribe to a combobox event (`open`, `optionsChange`, `loadingChange`,
 * `activeDescendantChange`, …). Must be used within a `Combobox.Provider`.
 *
 * The `open` event is dispatched by the combobox handle (it owns the open state, even before a list
 * registers). The other events are dispatched by the list registered on the combobox (see
 * {@link useCompositeEvent}); the composable re-subscribes when the registered list changes.
 *
 * `optionsChange` updates are coalesced into a microtask. Mounting a large option list fires one
 * `optionsChange` per option registration; applying each synchronously makes a consumer that both
 * reads the option count and (re)mounts options — e.g. `Combobox.Input` — mutate its own render
 * dependency, tripping Vue's recursive-update guard. Coalescing applies only the final value, once
 * per tick. Other events are applied synchronously.
 *
 * (React does not need this: it batches synchronous store updates itself, and coalescing there
 * would defer the update into a microtask that fires outside `act` in consumers' unit tests.)
 */
export function useComboboxEvent<K extends keyof CompositeEventMap>(
    event: K,
    initialValue: CompositeEventMap[K],
): Ref<CompositeEventMap[K]> {
    const { handle, list } = useComboboxContext();
    if (event !== 'open') return useCompositeEvent(list, event, initialValue);
    // The combobox `open` event has the same payload as the list one.
    return useHandleEvent(
        handle as Readonly<Ref<CompositeEventSource<Pick<CompositeEventMap, K>> | null>>,
        event,
        initialValue,
    );
}
