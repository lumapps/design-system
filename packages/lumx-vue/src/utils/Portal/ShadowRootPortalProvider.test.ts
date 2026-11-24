import { h, nextTick } from 'vue';
import { render } from '@testing-library/vue';
import { PORTAL_CONTAINER_CLASSNAME } from '@lumx/core/js/utils/Portal';
import { Portal } from './Portal';
import { ShadowRootPortalProvider } from './ShadowRootPortalProvider';

const TEST_ID = 'portal-child';
const PortalChild = () => h('div', { 'data-testid': TEST_ID }, 'Hello from portal');

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

        const child = document.body.querySelector(`[data-testid="${TEST_ID}"]`);
        expect(child?.parentElement).toBe(document.body);
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

        const container = shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`);
        const child = shadowRoot.querySelector(`[data-testid="${TEST_ID}"]`);
        expect(child?.parentElement).toBe(container);

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

        const container = shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`);
        const child = shadowRoot.querySelector(`[data-testid="${TEST_ID}"]`);
        expect(child?.parentElement).toBe(container);

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

        expect(shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`)).toBeNull();
        host.remove();
    });
});
