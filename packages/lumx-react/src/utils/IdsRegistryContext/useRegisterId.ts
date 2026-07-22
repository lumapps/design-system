import { useContext, useEffect, useRef } from 'react';

import { IdsRegistryContext } from './IdsRegistryContext';

/**
 * Register `id` under `key` in the enclosing ids registry on mount, and clear it on unmount.
 * Last registered wins; if another registrant is still mounted under the same key, clearing this
 * one falls back to it instead of leaving the key empty.
 *
 * @param key Registry key to store the id under.
 * @param id  Id of the element to register.
 */
export function useRegisterId(key: string, id: string | undefined): void {
    const registry = useContext(IdsRegistryContext);
    const token = useRef({}).current;

    useEffect(() => {
        registry?.setId(key, token, id);
        return () => registry?.setId(key, token, undefined);
    }, [registry, key, id, token]);
}
