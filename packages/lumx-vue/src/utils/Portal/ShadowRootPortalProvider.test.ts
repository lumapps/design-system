import { h, nextTick } from 'vue';
import { render, screen, within } from '@testing-library/vue';
import { PORTAL_CONTAINER_CLASSNAME } from '@lumx/core/js/utils/Portal';
import { Portal } from './Portal';
import { ShadowRootPortalProvider } from './ShadowRootPortalProvider';

const TEST_ID = 'portal-child';
const PortalChild = () => h('div', { 'data-testid': TEST_ID }, 'Hello from portal');

// `ShadowRoot` has no `getElementsByClassName`, so the `@lumx/core/testing/queries` class helpers
// (built on it) cannot query it: use `querySelector` for the container, Testing Library for the rest.
const getPortalContainer = (shadowRoot: ShadowRoot) => shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`);

const buildShadowRoot = () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const mountDiv = document.createElement('div');
    shadowRoot.appendChild(mountDiv);
    return { host, shadowRoot, mountDiv };
};

describe('ShadowRootPortalProvider', () => {
    it('should render the portal child in document.body in the normal document', async () => {
        render({
            components: { ShadowRootPortalProvider, Portal, PortalChild },
            template: '<ShadowRootPortalProvider><Portal><PortalChild /></Portal></ShadowRootPortalProvider>',
        });

        await nextTick();

        const child = screen.getByTestId(TEST_ID);
        expect(child.parentElement).toBe(document.body);
    });

    it('should render the portal child in the shadow root container', async () => {
        const { host, shadowRoot, mountDiv } = buildShadowRoot();

        const { unmount } = render(
            {
                components: { ShadowRootPortalProvider, Portal, PortalChild },
                template: '<ShadowRootPortalProvider><Portal><PortalChild /></Portal></ShadowRootPortalProvider>',
            },
            { container: mountDiv, baseElement: document.body },
        );

        await nextTick();

        const container = getPortalContainer(shadowRoot);
        const child = within(shadowRoot as unknown as HTMLElement).getByTestId(TEST_ID);
        expect(child.parentElement).toBe(container);

        unmount();
        host.remove();
    });

    it('should render the portal child in the container at the first render when anchor is set', () => {
        const { host, shadowRoot, mountDiv } = buildShadowRoot();
        const anchor = mountDiv;

        const { unmount } = render(
            {
                components: { ShadowRootPortalProvider, Portal, PortalChild },
                template:
                    '<ShadowRootPortalProvider :anchor="anchor"><Portal><PortalChild /></Portal></ShadowRootPortalProvider>',
                setup() {
                    return { anchor };
                },
            },
            { container: mountDiv, baseElement: document.body },
        );

        const container = getPortalContainer(shadowRoot);
        const child = within(shadowRoot as unknown as HTMLElement).getByTestId(TEST_ID);
        expect(child.parentElement).toBe(container);

        unmount();
        host.remove();
    });

    it('should remove the container from the shadow root on unmount', () => {
        const { host, shadowRoot, mountDiv } = buildShadowRoot();
        const anchor = mountDiv;

        const { unmount } = render(
            {
                components: { ShadowRootPortalProvider, Portal, PortalChild },
                template:
                    '<ShadowRootPortalProvider :anchor="anchor"><Portal><PortalChild /></Portal></ShadowRootPortalProvider>',
                setup() {
                    return { anchor };
                },
            },
            { container: mountDiv, baseElement: document.body },
        );

        unmount();

        expect(getPortalContainer(shadowRoot)).toBeNull();
        host.remove();
    });

    it('should move the portal child to the new shadow root when anchor changes', async () => {
        const a = buildShadowRoot();
        const b = buildShadowRoot();

        const { rerender, unmount } = render(
            {
                components: { ShadowRootPortalProvider, Portal, PortalChild },
                props: ['anchor'],
                template:
                    '<ShadowRootPortalProvider :anchor="anchor"><Portal><PortalChild /></Portal></ShadowRootPortalProvider>',
            },
            { props: { anchor: a.mountDiv }, container: a.mountDiv, baseElement: document.body },
        );

        expect(within(a.shadowRoot as unknown as HTMLElement).getByTestId(TEST_ID)).toBeTruthy();

        await rerender({ anchor: b.mountDiv });

        expect(getPortalContainer(a.shadowRoot)).toBeNull();
        expect(within(b.shadowRoot as unknown as HTMLElement).getByTestId(TEST_ID)).toBeTruthy();

        unmount();
        a.host.remove();
        b.host.remove();
    });
});
