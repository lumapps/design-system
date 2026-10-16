import type { CompositeEventMap, CompositeEventSource } from '@lumx/core/js/components/Composite/types';
import { useComboboxContext } from './ComboboxContext';
import { useEventSource } from '../../composite/useCompositeEvent';

/**
 * Hook to subscribe to a combobox event (`open`, `optionsChange`, `loadingChange`,
 * `activeDescendantChange`, …). Must be used within a `Combobox.Provider`.
 *
 * The `open` event is dispatched by the combobox handle (it owns the open state, even before a list
 * registers). The other events are dispatched by the list registered on the combobox (see
 * {@link useEventSource}); the hook re-subscribes when the registered list changes.
 */
export function useComboboxEvent<K extends keyof CompositeEventMap>(
    event: K,
    initialValue: CompositeEventMap[K],
): CompositeEventMap[K] {
    const { handle, list } = useComboboxContext();
    // The combobox `open` event has the same payload as the list one.
    const source = (event === 'open' ? handle : list) as CompositeEventSource<Pick<CompositeEventMap, K>> | null;
    return useEventSource(source, event, initialValue);
}
