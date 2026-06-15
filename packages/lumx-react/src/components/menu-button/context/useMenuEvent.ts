import { useEffect, useState } from 'react';

import type { MenuEventMap } from '@lumx/core/js/components/Menu/types';

import { useMenuContext } from './MenuContext';

/**
 * Subscribe to a menu event via the handle's subscriber system.
 * Re-subscribes when the handle changes (e.g. trigger mount/unmount).
 *
 * @param event        Event name to subscribe to.
 * @param initialValue Initial value used until the first event fires.
 * @returns The latest event payload (or `initialValue`).
 */
export function useMenuEvent<E extends keyof MenuEventMap>(event: E, initialValue: MenuEventMap[E]): MenuEventMap[E] {
    const { handle } = useMenuContext();
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        return handle.subscribe(event, setValue);
    }, [handle, event]);
    return value;
}
