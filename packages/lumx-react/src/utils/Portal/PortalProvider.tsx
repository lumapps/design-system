import React from 'react';

type Container = DocumentFragment | Element;

/**
 * Portal initializing function.
 * If it does not provide a container, the Portal children will render in classic React tree and not in a portal.
 */
export type PortalInit = () => {
    container?: Container;
    teardown?: () => void;
};

export const PortalContext = React.createContext<PortalInit>(() => ({ container: document.body }));

export interface PortalProviderProps {
    children?: React.ReactNode;
    value: PortalInit;
}

/**
 * Customize where <Portal> wrapped elements render (tooltip, popover, dialog, etc.)
 */
export const PortalProvider: React.FC<PortalProviderProps> = PortalContext.Provider;
