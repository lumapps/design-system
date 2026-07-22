import { inject, onUnmounted, ref, type Ref } from 'vue';

import { IDS_REGISTRY_KEY } from './IdsRegistryContext';

/**
 * Subscribe to the id currently registered under `key` in the enclosing ids registry. The returned
 * ref updates (and only re-renders the reading component) when that key's id changes.
 *
 * Call from a descendant's `setup`.
 *
 * @param  key Registry key to read.
 * @return A ref holding the registered id (`undefined` when none / outside any provider).
 */
export function useRegisteredId(key: string): Ref<string | undefined> {
    const registry = inject(IDS_REGISTRY_KEY, undefined);
    const id = ref<string | undefined>(registry?.getId(key));
    if (!registry) return id;

    onUnmounted(
        registry.subscribe(key, () => {
            id.value = registry.getId(key);
        }),
    );

    return id;
}
