import { useEffect, useState } from 'react';

import type { ComboboxEventMap } from '@lumx/core/js/components/Combobox/types';

import { useComboboxContext } from './ComboboxContext';

/**
 * Hook to subscribe to a combobox event via the handle's subscriber system.
 * Re-subscribes when the handle changes (e.g. trigger mount/unmount).
 */
export function useComboboxEvent<K extends keyof ComboboxEventMap>(
    event: K,
    initialValue: ComboboxEventMap[K],
): ComboboxEventMap[K] {
    const { handle } = useComboboxContext();
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        return handle?.subscribe(event, setValue);
    }, [handle, event]);
    return value;
}
