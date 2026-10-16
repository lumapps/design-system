import type { Ref } from 'vue';
import type { ComboboxEventMap } from '@lumx/core/js/components/Combobox/types';
import { useComboboxContext } from './ComboboxContext';
import { useCompositeEvent } from '../../composite/useCompositeEvent';

/**
 * Composable to subscribe to a combobox event (`open`, `expanded`, `optionsChange`, `loadingChange`,
 * `activeDescendantChange`, …). Must be used within a `Combobox.Provider`.
 *
 * The combobox handle owns the `open` and `expanded` events (even before a list registers) and forwards the other events
 * from the registered list: it re-subscribes when the registered list changes and dispatches the snapshot of
 * the new list (see `ComboboxEventMap`). `optionsChange` updates are coalesced (see `useCompositeEvent`).
 */
export function useComboboxEvent<K extends keyof ComboboxEventMap>(
    event: K,
    initialValue: ComboboxEventMap[K],
): Ref<ComboboxEventMap[K]> {
    const { handle } = useComboboxContext();
    return useCompositeEvent<ComboboxEventMap, K>(handle, event, initialValue);
}
