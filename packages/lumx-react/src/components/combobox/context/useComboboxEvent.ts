import type { ListboxEventMap } from '@lumx/core/js/components/Listbox/types';
import { useComboboxContext } from './ComboboxContext';
import { useListboxEvent } from '../../listbox/context/useListboxEvent';

/**
 * Hook to subscribe to a combobox event (`open`, `optionsChange`, `loadingChange`,
 * `activeDescendantChange`, …). Must be used within a `Combobox.Provider`.
 *
 * The events are dispatched by the listbox handle of the combobox (see {@link useListboxEvent}).
 */
export function useComboboxEvent<K extends keyof ListboxEventMap>(
    event: K,
    initialValue: ListboxEventMap[K],
): ListboxEventMap[K] {
    const { handle } = useComboboxContext();
    return useListboxEvent(handle?.list ?? null, event, initialValue);
}
