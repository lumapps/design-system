import { inject, onUnmounted, watchEffect } from 'vue';

import { IDS_REGISTRY_KEY } from './IdsRegistryContext';

/**
 * Register the id returned by `getId` under `key` in the enclosing ids registry, keeping it up to
 * date reactively, and clear it on unmount. Last registered wins; if another registrant is still
 * mounted under the same key, clearing this one falls back to it instead of leaving the key empty.
 *
 * Call from a descendant's `setup`.
 *
 * @param key   Registry key to store the id under.
 * @param getId Getter returning the id of the element to register.
 */
export function useRegisterId(key: string, getId: () => string | undefined): void {
    const registry = inject(IDS_REGISTRY_KEY, undefined);
    if (!registry) return;

    const token = {};

    watchEffect(() => {
        registry.setId(key, token, getId());
    });

    onUnmounted(() => {
        registry.setId(key, token, undefined);
    });
}
