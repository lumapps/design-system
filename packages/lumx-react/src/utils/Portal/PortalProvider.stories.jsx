import { Button } from '@lumx/react';
import React from 'react';
import { PortalProvider } from './PortalProvider';
import { Portal } from './Portal';

export default {
    title: 'LumX components/PortalProvider',
    component: PortalProvider,
};

const initShadowDOMPortal = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const container = div.attachShadow({ mode: 'closed' });
    const style = document.createElement('style');
    style.innerText = `button { color: red; }`;
    container.appendChild(style);
    return { container, teardown: () => div.remove() };
};

/**
 * Demonstrate how to customize portals to render into a custom shadow root
 */
export const RenderInShadowDOM = {
    args: { enabled: true },
    render: ({ enabled }) => (
        <PortalProvider value={initShadowDOMPortal}>
            <Portal enabled={enabled}>
                <Button>My button {!enabled && 'not'} in a shadow DOM portal</Button>
            </Portal>
        </PortalProvider>
    ),
    parameters: { chromatic: { disable: true } },
};
