import React from 'react';
import { createPortal } from 'react-dom';
import { PortalContext } from './PortalProvider';

export interface PortalProps {
    enabled?: boolean;
    children: React.ReactNode;
}

/**
 * Render children in a portal outside the current DOM position
 * (defaults to `document.body` but can be customized with the PortalContextProvider)
 */
export const Portal: React.FC<PortalProps> = ({ children, enabled = true }) => {
    const init = React.useContext(PortalContext);
    const context = React.useMemo(
        () => {
            return enabled ? init() : null;
        },
        // Only update on 'enabled'
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled],
    );

    React.useLayoutEffect(() => {
        return context?.teardown;
    }, [context?.teardown, enabled]);

    if (!context?.container) {
        return <>{children}</>;
    }
    return createPortal(children, context.container);
};
