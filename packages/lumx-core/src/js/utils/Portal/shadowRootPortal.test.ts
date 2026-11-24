// @vitest-environment jsdom
import { PORTAL_CONTAINER_CLASSNAME, getShadowRootPortalContainer } from './shadowRootPortal';

describe('getShadowRootPortalContainer', () => {
    it('should return body for an anchor in the document', () => {
        const anchor = document.createElement('div');
        document.body.appendChild(anchor);

        const { container } = getShadowRootPortalContainer(anchor);

        expect(container).toBe('body');
        expect(document.querySelectorAll(`.${PORTAL_CONTAINER_CLASSNAME}`)).toHaveLength(0);
    });

    it('should return body when there is no anchor', () => {
        const { container } = getShadowRootPortalContainer();

        expect(container).toBe('body');
    });

    it('should return a portal container div in the shadow root of the anchor', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('div');
        shadowRoot.appendChild(anchor);

        const { container } = getShadowRootPortalContainer(anchor);

        expect(container).toBeInstanceOf(HTMLDivElement);
        const containerEl = container as HTMLDivElement;
        expect(containerEl.classList.contains(PORTAL_CONTAINER_CLASSNAME)).toBe(true);
        expect(containerEl.parentNode).toBe(shadowRoot);
    });

    it('should return the same container for two calls on the same shadow root', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('div');
        shadowRoot.appendChild(anchor);

        const first = getShadowRootPortalContainer(anchor);
        const second = getShadowRootPortalContainer(anchor);

        expect(first.container).toBe(second.container);
    });

    it('should keep the container after the first teardown and remove it after the second', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('div');
        shadowRoot.appendChild(anchor);

        const first = getShadowRootPortalContainer(anchor);
        const second = getShadowRootPortalContainer(anchor);

        first.teardown?.();
        expect(shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`)).not.toBeNull();

        second.teardown?.();
        expect(shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`)).toBeNull();
    });

    it('should keep the container when the same teardown runs twice', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('div');
        shadowRoot.appendChild(anchor);

        const first = getShadowRootPortalContainer(anchor);
        getShadowRootPortalContainer(anchor);

        first.teardown?.();
        first.teardown?.();

        expect(shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`)).not.toBeNull();
    });

    it('should create a new container when the app removes the existing one', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('div');
        shadowRoot.appendChild(anchor);

        const first = getShadowRootPortalContainer(anchor);
        (first.container as HTMLDivElement).remove();

        const second = getShadowRootPortalContainer(anchor);

        expect(second.container).not.toBe(first.container);
        expect(shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`)).toBe(second.container);
    });

    it('should not let a stale holder remove the container or the entry of a holder that replaced it', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const anchor = document.createElement('div');
        shadowRoot.appendChild(anchor);

        const stale = getShadowRootPortalContainer(anchor);
        (stale.container as HTMLDivElement).remove();

        const replacement = getShadowRootPortalContainer(anchor);
        stale.teardown?.();

        expect(shadowRoot.querySelector(`.${PORTAL_CONTAINER_CLASSNAME}`)).toBe(replacement.container);

        const another = getShadowRootPortalContainer(anchor);
        expect(another.container).toBe(replacement.container);
    });
});
