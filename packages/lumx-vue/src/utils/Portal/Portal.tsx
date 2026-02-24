import { defineComponent, inject, onBeforeUnmount, Teleport, ref, watch } from 'vue';
import { PORTAL_KEY, defaultPortalInit } from './PortalProvider';

export type { PortalProps } from '@lumx/core/js/utils/Portal';
import type { PortalProps } from '@lumx/core/js/utils/Portal';

/**
 * Render children in a portal outside the current DOM position
 * (defaults to `document.body` but can be customized with the PortalProvider)
 */
export const Portal = defineComponent(
    (props: PortalProps, { slots }) => {
        const portalInit = inject(PORTAL_KEY, defaultPortalInit);
        const context = ref<ReturnType<typeof portalInit> | null>(null);

        // Initialize portal context when enabled
        const initializePortal = () => {
            if (props.enabled) {
                context.value = portalInit();
            } else {
                context.value = null;
            }
        };

        // Initialize on mount and when enabled changes
        initializePortal();
        watch(() => props.enabled, initializePortal);

        // Register teardown on unmount
        onBeforeUnmount(() => {
            context.value?.teardown?.();
        });

        return () => {
            const content = slots.default?.();
            const container = context.value?.container;

            // If disabled or no container, render inline
            if (!props.enabled || !container) {
                return content;
            }

            // Render in portal using Teleport
            return <Teleport to={container}>{content}</Teleport>;
        };
    },
    {
        name: 'LumxPortal',
        props: {
            enabled: {
                type: Boolean,
                default: true,
            },
        },
    },
);
