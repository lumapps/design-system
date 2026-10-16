import { computed, type Ref } from 'vue';
import type { CompositeEventMap } from '@lumx/core/js/components/Composite/types';
import { useComboboxContext } from './ComboboxContext';
import { useCompositeEvent } from '../../composite/useCompositeEvent';

/**
 * Composable to subscribe to a combobox event (`open`, `optionsChange`, `loadingChange`,
 * `activeDescendantChange`, …). Must be used within a `Combobox.Provider`.
 *
 * The events are dispatched by the listbox handle of the combobox (see {@link useCompositeEvent}).
 * `optionsChange` updates are coalesced (see `useCompositeEvent`).
 */
export function useComboboxEvent<K extends keyof CompositeEventMap>(
    event: K,
    initialValue: CompositeEventMap[K],
): Ref<CompositeEventMap[K]> {
    const { handle } = useComboboxContext();
    return useCompositeEvent(
        computed(() => handle.value?.list ?? null),
        event,
        initialValue,
    );
}
