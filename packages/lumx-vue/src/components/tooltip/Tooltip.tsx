import { defineComponent, ref, computed } from 'vue';
import { useFloating, offset, autoUpdate } from '@floating-ui/vue';

import {
    TooltipPopup,
    type TooltipProps as CoreTooltipProps,
    type TooltipPlacement,
    DEFAULT_PROPS,
    ARROW_SIZE,
} from '@lumx/core/js/components/Tooltip';

import { useId } from '../../composables/useId';
import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
import { useTooltipOpen } from './useTooltipOpen';
import { useInjectTooltipRef } from './useInjectTooltipRef';
import { provideTooltipContext } from './context';
import { keysOf } from '../../utils/VueToJSX';
import { Portal } from '../../utils/Portal';

export type { TooltipPlacement };

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends CoreTooltipProps {
    /** Class name forwarded to the tooltip popup */
    class?: string;
}

/**
 * Vue Tooltip component.
 * Wraps the shared core TooltipPopup with Vue-specific Floating UI, Portal, and slot injection.
 */
export const Tooltip = defineComponent(
    (props: TooltipProps, { slots }) => {
        const id = useId();
        const anchorElement = ref<HTMLElement | null>(null);
        const popperElement = ref<HTMLElement | null>(null);

        const placement = computed(() => props.placement || DEFAULT_PROPS.placement!);
        const closeMode = computed(() => props.closeMode || DEFAULT_PROPS.closeMode!);
        const ariaLinkMode = computed(() => props.ariaLinkMode || DEFAULT_PROPS.ariaLinkMode!);
        const zIndex = computed(() => props.zIndex || DEFAULT_PROPS.zIndex!);

        // Floating UI positioning
        const { floatingStyles, placement: resolvedPlacement } = useFloating(anchorElement, popperElement, {
            placement,
            whileElementsMounted: autoUpdate,
            middleware: [offset(ARROW_SIZE)],
        });

        // Open/close state machine
        const {
            isOpen: isActivated,
            onPopperMount,
            manager,
        } = useTooltipOpen(
            computed(() => props.delay),
            anchorElement,
        );

        // Visibility state (include isInsideTooltip check to prevent nested tooltips)
        const isOpen = computed(() => (isActivated.value || props.forceOpen) && !!props.label);
        const isMounted = computed(() => !!props.label && (isOpen.value || closeMode.value === 'hide'));
        const isHidden = computed(() => !isOpen.value && closeMode.value === 'hide');

        // Escape key handler (reactive — updates when isOpen changes)
        useCallbackOnEscape(computed(() => (isOpen.value ? () => manager.value?.close() : undefined)));

        // Provide context to prevent nested tooltips (called in setup, not render)
        provideTooltipContext();

        return () => {
            const position = resolvedPlacement.value ?? placement.value;

            // Inject ref + ARIA into anchor slot
            const wrappedChildren = useInjectTooltipRef({
                slotContent: slots.default?.(),
                setAnchorElement: (el: any) => {
                    // Handle Vue component instances (el.$el) vs DOM elements
                    anchorElement.value = el?.$el || el;
                },
                isMounted: isMounted.value,
                id,
                label: props.label,
                ariaLinkMode: ariaLinkMode.value,
            });

            return (
                <>
                    {wrappedChildren}

                    {/* Tooltip popup via Portal */}
                    {isMounted.value && (
                        <Portal>
                            {TooltipPopup({
                                ref: (el: any) => {
                                    const element = el?.$el || el;
                                    popperElement.value = element;
                                    onPopperMount(element);
                                },
                                id,
                                label: props.label as string,
                                position,
                                isHidden: isHidden.value,
                                style: isHidden.value ? undefined : floatingStyles.value,
                                zIndex: zIndex.value,
                                className: props.class,
                            })}
                        </Portal>
                    )}
                </>
            );
        };
    },
    {
        name: 'LumxTooltip',
        inheritAttrs: false,
        props: keysOf<TooltipProps>()(
            'label',
            'placement',
            'delay',
            'forceOpen',
            'closeMode',
            'ariaLinkMode',
            'zIndex',
            'class',
        ),
    },
);
