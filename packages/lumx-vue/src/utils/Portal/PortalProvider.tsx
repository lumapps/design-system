import { defineComponent, provide, type PropType, type InjectionKey } from 'vue';

export type { PortalInit, PortalProviderProps } from '@lumx/core/js/utils/Portal';
import type { PortalInit, PortalProviderProps } from '@lumx/core/js/utils/Portal';
import { COMPAT_OPTIONS } from '../compat/compatOptions';

export const PORTAL_KEY: InjectionKey<PortalInit> = Symbol('LumxPortal');

export const defaultPortalInit: PortalInit = () => ({ container: 'body' });

/**
 * Customize where <Portal> wrapped elements render (tooltip, popover, dialog, etc.)
 */
export const PortalProvider = defineComponent(
    (props: PortalProviderProps, { slots }) => {
        provide(PORTAL_KEY, props.value);
        return () => slots.default?.();
    },
    {
        ...COMPAT_OPTIONS,
        name: 'LumxPortalProvider',
        props: {
            value: {
                type: Function as PropType<PortalInit>,
                required: true,
            },
        },
    },
);
