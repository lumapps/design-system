import type { Container } from './index';

export const PORTAL_CONTAINER_CLASSNAME = 'lumx-portal-container';

interface ShadowRootPortalHandle {
    container: Container;
    teardown?: () => void;
}

interface ShadowRootHolder {
    container: HTMLDivElement;
    holders: number;
}

const holdersByShadowRoot = new WeakMap<ShadowRoot, ShadowRootHolder>();

const isShadowRoot = (root: Node): root is ShadowRoot => root instanceof ShadowRoot || 'host' in root;

/**
 * Find or create the one portal container of a shadow root.
 * Outside a shadow root, return 'body', the value of the default portal init.
 */
export const getShadowRootPortalContainer = (anchor?: Node | null): ShadowRootPortalHandle => {
    const root = anchor?.getRootNode?.();
    if (!root || !isShadowRoot(root)) {
        return { container: 'body' };
    }

    let holder = holdersByShadowRoot.get(root);
    if (!holder || !root.contains(holder.container)) {
        const existing = root.querySelector<HTMLDivElement>(`.${PORTAL_CONTAINER_CLASSNAME}`);
        const container = existing ?? document.createElement('div');
        if (!existing) {
            container.classList.add(PORTAL_CONTAINER_CLASSNAME);
            root.appendChild(container);
        }
        holder = { container, holders: 0 };
        holdersByShadowRoot.set(root, holder);
    }

    holder.holders += 1;
    const currentHolder = holder;
    let released = false;
    const teardown = () => {
        if (released) {
            return;
        }
        released = true;
        currentHolder.holders -= 1;
        // A stale holder (its container removed from the DOM by the app) can live on after a newer
        // holder replaced it in the map: only the current holder may remove the container or the entry.
        if (currentHolder.holders <= 0 && holdersByShadowRoot.get(root) === currentHolder) {
            currentHolder.container.remove();
            holdersByShadowRoot.delete(root);
        }
    };

    return { container: holder.container, teardown };
};
