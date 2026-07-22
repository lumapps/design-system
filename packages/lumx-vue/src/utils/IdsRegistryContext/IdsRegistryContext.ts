import { type InjectionKey } from 'vue';

import { type IdsRegistry } from '@lumx/core/js/utils/idsRegistry/createIdsRegistry';

/**
 * Internal "ids registry" injection key.
 *
 * Not exported from the package barrel - lets a container expose ids registered by its descendants
 * under well-known names, without either side knowing about the other upfront (e.g. to wire up
 * `aria-labelledby`/`aria-describedby` between components that don't know about each other).
 *
 * `undefined` outside of any provider - `useRegisterId`/`useRegisteredId` are no-ops in that case.
 *
 * See `IdsRegistry` in `@lumx/core` for the shared contract.
 */
export const IDS_REGISTRY_KEY: InjectionKey<IdsRegistry> = Symbol('LumxIdsRegistry');
