import React from 'react';
import { Button } from '@lumx/react';
import { initDemoShadowDOMPortal } from '@lumx/react/stories/utils/initDemoShadowDOMPortal';
import { PortalProvider } from './PortalProvider';
import { Portal } from './Portal';

export default {
    title: 'LumX components/PortalProvider',
    component: PortalProvider,
    args: { enabled: true },
    parameters: { chromatic: { disable: true } },
};

/**
 * Demonstrate how to customize portals to render into a custom shadow root
 */
export const RenderInShadowDOM = ({ enabled }) => (
    <PortalProvider value={initDemoShadowDOMPortal}>
        <Portal enabled={enabled}>
            <Button>My button {!enabled && 'not'} in a shadow DOM portal</Button>
        </Portal>
    </PortalProvider>
);
