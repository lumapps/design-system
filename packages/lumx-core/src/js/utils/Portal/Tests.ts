import type { Screen } from '@testing-library/dom';
import type { PortalInit } from '.';

const TEST_ID = 'portal-child';
const PORTAL_CONTAINER_ID = 'portal-container';

export interface PortalTestOptions {
    screen: Screen;
    /**
     * Render Portal with a child element (a div with `data-testid="portal-child"` containing "Hello from portal").
     * Return the render result (must have a `container` property for wrapper queries and `unmount` for cleanup).
     */
    renderPortal(options: {
        enabled?: boolean;
        /** Wrap the Portal in a PortalProvider with this value */
        portalInit?: PortalInit;
        /** Wrap the Portal + PortalProvider in a div#wrapper */
        wrapInDiv?: boolean;
    }): { container: Element; unmount: () => void };
}

/**
 * Shared Portal + PortalProvider tests.
 * Framework-specific render logic is injected via `renderPortal`.
 */
export default ({ screen, renderPortal }: PortalTestOptions) => {
    describe('Portal core tests', () => {
        it('should render portal content in document.body by default', () => {
            renderPortal({});

            const child = screen.getByTestId(TEST_ID);
            expect(child.parentElement).toBe(document.body);
        });

        it('should render inline when enabled is false', () => {
            const { container } = renderPortal({ enabled: false, wrapInDiv: true });

            const child = screen.getByTestId(TEST_ID);
            expect(child.parentElement).toBe(container.querySelector('#wrapper'));
        });

        it('should accept slot content', () => {
            renderPortal({});

            const content = screen.getByTestId(TEST_ID);
            expect(content).toBeInTheDocument();
            expect(content.textContent).toBe('Hello from portal');
        });
    });

    describe('PortalProvider core tests', () => {
        it('should render portal content in the provided container', () => {
            const portalContainer = document.createElement('div');
            portalContainer.id = PORTAL_CONTAINER_ID;
            document.body.appendChild(portalContainer);

            const getContainer: PortalInit = () => ({ container: portalContainer });

            renderPortal({ portalInit: getContainer });

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

            const { unmount } = renderPortal({ portalInit: getContainer });

            expect(teardownMock).not.toHaveBeenCalled();
            unmount();
            expect(teardownMock).toHaveBeenCalledTimes(1);
            portalContainer.remove();
        });

        it('should render inline if provider does not return a container', () => {
            const getContainer: PortalInit = () => ({}); // No container

            const { container } = renderPortal({ portalInit: getContainer, wrapInDiv: true });

            const child = screen.getByTestId(TEST_ID);
            expect(child.parentElement).toBe(container.querySelector('#wrapper'));
        });
    });
};
