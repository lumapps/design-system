import React from 'react';
import type { PortalInit } from '@lumx/core/js/utils/Portal';

export type { PortalInit, PortalProviderProps } from '@lumx/core/js/utils/Portal';

export const PortalContext = React.createContext<PortalInit>(() => ({ container: document.body }));

export interface ReactPortalProviderProps {
    children?: React.ReactNode;
    value: PortalInit;
}

/**
 * Customize where <Portal> wrapped elements render (tooltip, popover, dialog, etc.)
 */
export const PortalProvider: React.FC<ReactPortalProviderProps> = PortalContext.Provider;
