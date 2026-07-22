import { defineComponent, provide } from 'vue';

import { createIdsRegistry } from '@lumx/core/js/utils/idsRegistry/createIdsRegistry';
import { COMPONENT_NAME } from '@lumx/core/js/utils/idsRegistry/constants';

import { getName } from '../VueToJSX';
import { IDS_REGISTRY_KEY } from './IdsRegistryContext';

/**
 * Provides a fresh ids registry to its subtree (via the default slot). The registry instance lives
 * for the lifetime of the provider, so registering/reading an id never re-renders the whole subtree
 * - only the components subscribed (via `useRegisteredId`) to the name that changed.
 */
export const IdsRegistryProvider = defineComponent({
    name: getName(COMPONENT_NAME),
    setup(_props, { slots }) {
        provide(IDS_REGISTRY_KEY, createIdsRegistry());
        return () => slots.default?.();
    },
});
