import {
    defineComponent,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    provide,
    shallowRef,
    watch,
    type PropType,
} from 'vue';

import { getShadowRootPortalContainer, type Container } from '@lumx/core/js/utils/Portal';
import { PORTAL_KEY } from './PortalProvider';

export interface ShadowRootPortalProviderProps {
    /** Element whose root node gives the shadow root to portal into. Defaults to the component's own anchor. */
    anchor?: Element | null;
}

/**
 * Keep overlays (dialog, tooltip, lightbox, popovers) inside the shadow root of the wrapped app,
 * so they keep the app styles. Outside a shadow root, overlays keep rendering in `document.body`.
 */
export const ShadowRootPortalProvider = defineComponent(
    (props: ShadowRootPortalProviderProps, { slots }) => {
        const container = shallowRef<Container | undefined>();
        let handle: ReturnType<typeof getShadowRootPortalContainer> | undefined;

        const resolve = (anchor?: Node | null) => {
            handle = getShadowRootPortalContainer(anchor);
            container.value = handle.container;
        };

        const release = () => {
            handle?.teardown?.();
            handle = undefined;
        };

        if (props.anchor) {
            resolve(props.anchor);
        } else {
            // Renderless component: `vnode.el` is its fragment anchor node, which answers `getRootNode()`.
            onMounted(() => resolve(getCurrentInstance()?.vnode.el as Node | null));
        }

        watch(
            () => props.anchor,
            (anchor) => {
                release();
                resolve(anchor);
            },
        );

        onBeforeUnmount(release);

        provide(PORTAL_KEY, () => ({
            get container() {
                return container.value;
            },
        }));

        return () => slots.default?.();
    },
    {
        name: 'LumxShadowRootPortalProvider',
        props: {
            anchor: {
                type: Object as PropType<Element | null>,
                default: null,
            },
        },
    },
);
