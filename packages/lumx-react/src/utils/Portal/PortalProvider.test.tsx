import { render, screen } from '@testing-library/react';
import { PortalInit, PortalProvider } from './PortalProvider';
import { Portal } from './Portal';

const TEST_ID = 'portal-child';
const PORTAL_CONTAINER_ID = 'portal-container';

const PortalChild = () => <div data-testid={TEST_ID}>Hello from portal</div>;

describe('PortalProvider', () => {
    it('should render portal content in the provided container', () => {
        const portalContainer = document.createElement('div');
        portalContainer.id = PORTAL_CONTAINER_ID;
        document.body.appendChild(portalContainer);

        const getContainer: PortalInit = () => ({ container: portalContainer });

        render(
            <PortalProvider value={getContainer}>
                <Portal>
                    <PortalChild />
                </Portal>
            </PortalProvider>,
        );

        const child = screen.getByTestId(TEST_ID);
        expect(child.parentElement).toBe(portalContainer);
        portalContainer.remove();
    });

    it('should call teardown on unmount', () => {
        const teardownMock = vi.fn();
        const portalContainer = document.createElement('div');
        portalContainer.id = PORTAL_CONTAINER_ID;
        document.body.appendChild(portalContainer);

        const getContainer: PortalInit = () => ({
            container: portalContainer,
            teardown: teardownMock,
        });

        const { unmount } = render(
            <PortalProvider value={getContainer}>
                <Portal>
                    <PortalChild />
                </Portal>
            </PortalProvider>,
        );

        expect(teardownMock).not.toHaveBeenCalled();
        unmount();
        expect(teardownMock).toHaveBeenCalledTimes(1);
        portalContainer.remove();
    });

    it('should render inline if provider does not return a container', () => {
        const getContainer: PortalInit = () => ({}); // No container

        const { container } = render(
            <div id="wrapper">
                <PortalProvider value={getContainer}>
                    <Portal>
                        <PortalChild />
                    </Portal>
                </PortalProvider>
            </div>,
        );

        const child = screen.getByTestId(TEST_ID);
        expect(child.parentElement).toBe(container.querySelector('#wrapper'));
    });
});
