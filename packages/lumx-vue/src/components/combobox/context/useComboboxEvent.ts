import { computed, type Ref } from 'vue';
import type { ListboxEventMap } from '@lumx/core/js/components/Listbox/types';
import { useComboboxContext } from './ComboboxContext';
import { useListboxEvent } from '../../listbox/context/useListboxEvent';

/**
 * Composable to subscribe to a combobox event (`open`, `optionsChange`, `loadingChange`,
 * `activeDescendantChange`, …). Must be used within a `Combobox.Provider`.
 *
 * The events are dispatched by the listbox handle of the combobox (see {@link useListboxEvent}).
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
export function useComboboxEvent<K extends keyof ListboxEventMap>(
    event: K,
    initialValue: ListboxEventMap[K],
): Ref<ListboxEventMap[K]> {
    const { handle } = useComboboxContext();
    return useListboxEvent(
        computed(() => handle.value?.list ?? null),
        event,
        initialValue,
    );
}
