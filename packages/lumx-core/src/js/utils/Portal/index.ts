/**
 * Shared types for Portal and PortalProvider.
 *
 * Portal renders children in a subtree outside the current DOM hierarchy.
 * PortalProvider customizes where Portal children render.
 *
 * Unlike other core components, Portal has no shared render function
 * since the implementation is entirely framework-specific
 * (React's createPortal vs Vue's Teleport).
 */

export type Container = DocumentFragment | Element | string;

/**
 * Portal initializing function.
 * If it does not provide a container, the Portal children will render in the standard component tree and not in a portal.
 */
export type PortalInit = () => {
    container?: Container;
    teardown?: () => void;
};

export interface PortalProps {
    enabled?: boolean;
}

export interface PortalProviderProps {
    value: PortalInit;
}
