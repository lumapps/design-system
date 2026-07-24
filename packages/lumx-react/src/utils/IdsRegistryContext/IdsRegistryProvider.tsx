import { ReactNode, useState } from 'react';

import { createIdsRegistry } from '@lumx/core/js/utils/idsRegistry/createIdsRegistry';

import { IdsRegistryContext } from './IdsRegistryContext';

export interface IdsRegistryProviderProps {
    children?: ReactNode;
}

/**
 * Provides a fresh ids registry to its subtree. The registry instance is stable for the lifetime of
 * the provider, so registering/reading an id never re-renders the whole subtree - only the
 * components subscribed (via `useRegisteredId`) to the name that changed.
 */
export const IdsRegistryProvider = ({ children }: IdsRegistryProviderProps) => {
    const [registry] = useState(createIdsRegistry);
    return <IdsRegistryContext.Provider value={registry}>{children}</IdsRegistryContext.Provider>;
};
