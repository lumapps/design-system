import { type Ref, ref } from 'vue';

import type { ComboboxEventMap } from '@lumx/core/js/components/Combobox/types';

import { useWatchDisposable } from '../../../composables/useWatchDisposable';
import { useComboboxContext } from './ComboboxContext';

/**
 * Composable to subscribe to a combobox event via the handle's subscriber system.
 * Re-subscribes when the handle changes (e.g. trigger mount/unmount).
 */
export function useComboboxEvent<K extends keyof ComboboxEventMap>(
    event: K,
    initialValue: ComboboxEventMap[K],
): Ref<ComboboxEventMap[K]> {
    const { handle } = useComboboxContext();
    const value = ref(initialValue) as Ref<ComboboxEventMap[K]>;

    useWatchDisposable(handle, (h) => {
        if (h) {
            return h.subscribe(event, (v) => {
                value.value = v;
            });
        }
    });

    return value;
}
