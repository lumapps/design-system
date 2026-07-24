import { useContext, useEffect, useState } from 'react';

import { IdsRegistryContext } from './IdsRegistryContext';

/**
 * Subscribe to the id currently registered under `key` in the enclosing ids registry. Re-renders
 * the calling component only when that key's id changes.
 *
 * Re-reads the registry's `getId` snapshot on mount/update (in case an id was registered between
 * render and commit, e.g. by a descendant in the same commit) before subscribing for later changes.
 *
 * @param  key Registry key to read.
 * @return The registered id, or `undefined` when none is registered / outside any provider.
 */
export function useRegisteredId(key: string): string | undefined {
    const registry = useContext(IdsRegistryContext);
    const [id, setId] = useState(() => registry?.getId(key));

    useEffect(() => {
        setId(registry?.getId(key));
        return registry?.subscribe(key, () => setId(registry.getId(key)));
    }, [registry, key]);

    return id;
}
