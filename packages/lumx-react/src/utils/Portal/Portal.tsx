import React from 'react';
import { createPortal } from 'react-dom';
import { PortalContext } from './PortalProvider';

export type { PortalProps } from '@lumx/core/js/utils/Portal';

export interface ReactPortalProps {
    enabled?: boolean;
    children: React.ReactNode;
}

/**
 * Render children in a portal outside the current DOM position
 * (defaults to `document.body` but can be customized with the PortalContextProvider)
 */
export const Portal: React.FC<ReactPortalProps> = ({ children, enabled = true }) => {
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

    const { container } = context ?? {};
    if (!container || typeof container === 'string') {
        return <>{children}</>;
    }
    return createPortal(children, container);
};
