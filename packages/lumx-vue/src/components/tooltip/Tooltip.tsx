import { defineComponent, ref, computed, watchPostEffect, onUpdated } from 'vue';
import { useFloating, offset, autoUpdate } from '@floating-ui/vue';

import {
    TooltipPopup,
    type TooltipProps as CoreTooltipProps,
    type TooltipPlacement,
    DEFAULT_PROPS,
    ARROW_SIZE,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Tooltip';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
import { useTooltipOpen } from './useTooltipOpen';
import { useInjectTooltipRef } from './useInjectTooltipRef';
import { provideTooltipContext } from './context';
import { getName, keysOf, type ClassValue } from '../../utils/VueToJSX';
import { Portal } from '../../utils/Portal';

export type { TooltipPlacement };

/**
 * Defines the props of the component.
 */
export interface TooltipProps extends CoreTooltipProps {
    /** Class name forwarded to the tooltip popup */
    class?: ClassValue;
}

/**
 * Vue Tooltip component.
 * Wraps the shared core TooltipPopup with Vue-specific Floating UI, Portal, and slot injection.
 */
export const Tooltip = defineComponent(
    (props: TooltipProps, { slots }) => {
        const id = useId();
        const className = useClassName(() => props.class);
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

        const resolvedFunctionLabel = ref<string | null | false | undefined>(undefined);

        const resolveLabel = () => {
            const currentLabel = props.label;
            if (typeof currentLabel === 'function') resolvedFunctionLabel.value = currentLabel();
        };

        // Open/close state machine
        const {
            isOpen: isActivated,
            onPopperMount,
            manager,
        } = useTooltipOpen(
            computed(() => props.delay),
            anchorElement,
            resolveLabel,
        );

        const resolvedLabel = computed(() =>
            typeof props.label === 'function' ? resolvedFunctionLabel.value : props.label,
        );
        const hasLabel = computed(() => typeof props.label === 'function' || !!props.label);

        // Visibility state (include isInsideTooltip check to prevent nested tooltips)
        const isOpen = computed(() => (isActivated.value || props.forceOpen) && !!resolvedLabel.value);
        const isMounted = computed(() => !!resolvedLabel.value && (isOpen.value || closeMode.value === 'hide'));
        const isHidden = computed(() => !isOpen.value && closeMode.value === 'hide');

        // Resolve before the first render; the post effect below follows the later `forceOpen` changes.
        if (props.forceOpen) resolveLabel();

        // The post effect tracks the reactive state that a function label reads, and runs after the mount (the setup
        // has no DOM yet). `onUpdated` covers the DOM changes that no reactive state tracks.
        const resolveIfOpen = () => {
            if (isActivated.value || props.forceOpen) resolveLabel();
        };
        watchPostEffect(resolveIfOpen);
        onUpdated(resolveIfOpen);

        // A stable callback, else each label change registers the listener again on top of the more recent ones.
        const closeTooltip = () => manager.value?.close();
        // A forced-open tooltip does not take Escape from its container (ex: the highlighted option of a combobox).
        useCallbackOnEscape(computed(() => (isActivated.value && !!resolvedLabel.value ? closeTooltip : undefined)));

        // Provide context to prevent nested tooltips (called in setup, not render)
        provideTooltipContext();

        const setAnchorElement = (el: any) => {
            // Handle Vue component instances (el.$el) vs DOM elements
            anchorElement.value = el?.$el || el;
        };

        return () => {
            const position = resolvedPlacement.value ?? placement.value;

            // Inject ref + ARIA into anchor slot
            const wrappedChildren = useInjectTooltipRef({
                slotContent: slots.default?.(),
                setAnchorElement,
                isMounted: isMounted.value,
                id,
                label: resolvedLabel.value,
                hasLabel: hasLabel.value,
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
                                label: resolvedLabel.value as string,
                                position,
                                isHidden: isHidden.value,
                                style: isHidden.value ? undefined : floatingStyles.value,
                                zIndex: zIndex.value,
                                className: className.value,
                            })}
                        </Portal>
                    )}
                </>
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<TooltipProps>()(
            'label',
            'placement',
            'delay',
            ['forceOpen', Boolean],
            'closeMode',
            'ariaLinkMode',
            'zIndex',
            'class',
        ),
    },
);
