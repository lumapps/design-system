import { render, screen } from '@testing-library/react';
import BasePortalTests from '@lumx/core/js/utils/Portal/Tests';
import { Portal } from './Portal';
import { PortalProvider } from './PortalProvider';

const TEST_ID = 'portal-child';
const PortalChild = () => <div data-testid={TEST_ID}>Hello from portal</div>;

describe('Portal', () => {
    // Run shared core tests
    BasePortalTests({
        screen,
        renderPortal({ enabled, portalInit, wrapInDiv }) {
            const portal = (
                <Portal enabled={enabled}>
                    <PortalChild />
                </Portal>
            );

            const withProvider = portalInit ? <PortalProvider value={portalInit}>{portal}</PortalProvider> : portal;

            const content = wrapInDiv ? <div id="wrapper">{withProvider}</div> : withProvider;

            return render(content);
        },
    });
});
