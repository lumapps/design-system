import { VNode, SetupContext, EmitsOptions, FunctionalComponent } from 'vue';

import type { NestedComponents } from '@lumx/core/js/types';
import { VueToJSXProps } from './VueToJSXProps';

/**
 * Props type that includes optional children for JSX compatibility.
 */
type GenericPropsWithChildren = Record<string, any>;

export type { VueToJSXProps } from './VueToJSXProps';

type VueEmits = EmitsOptions | Record<string, any[]>;

/**
 * Options for configuring VueToJSX wrapper behavior.
 */
export interface VueToJSXOptions<Emits extends VueEmits = Record<string, never>> {
    /** Vue emit function to handle events */
    emit?: SetupContext<Emits>['emit'];
    /** List of event names to bind (e.g., ['click', 'focus']) */
    events?: string[];
    nestedComponents?: NestedComponents;
}

export const keysOf = <T>() => {
    return <K extends readonly (keyof T)[]>(
        ...keys: [keyof T] extends [K[number]]
            ? K
            : [Error: '❌ Missing keys in your list:', Exclude<keyof T, K[number]>]
    ): K => keys as any;
};

/**
 * Higher-order component that wraps a LumX Core component (which uses JSX patterns)
 * to be used as a Vue functional component.
 *
 * It specifically handles:
 * - Mapping Vue's `class` prop to LumX Core's `className` prop.
 * - Mapping Vue's default slot to LumX Core's `children` prop.
 * - Optionally binding Vue events to JSX event handlers.
 *
 * @param Component The LumX Core component to wrap.
 * @param options Optional configuration for event handling.
 * @returns A Vue functional component.
 *
 * @example
 * // Simple usage (no events)
 * const ui = VueToJSX(IconUI);
 *
 * @example
 * // With event handling
 * const emit = defineEmits(emitSchema);
 * const ui = VueToJSX<ButtonProps, typeof emitSchema>(ButtonUI, {
 *   emit,
 *   events: Object.keys(emitSchema)
 * });
 */
export const VueToJSX = <Props extends GenericPropsWithChildren, Emits extends VueEmits = Record<string, never>>(
    Component: (props: Props, nestedComponents?: NestedComponents) => VNode,
    options?: VueToJSXOptions<Emits>,
) => {
    function funcComponent(props: Props, context: SetupContext<Emits>) {
        const { emit, events, nestedComponents } = options || {};
        const { slots } = context;
        const defaultSlot = slots.default;

        /**
         * Generate event handlers dynamically based on the `events` array.
         * For each event (e.g., 'click'), it creates a prop following the 'on<Event>'
         * convention (e.g., 'onClick') that calls Vue's `emit` function.
         */
        const eventHandlers =
            events?.reduce(
                (acc, event) => {
                    const propName = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
                    acc[propName] = (e: any) => emit?.(event, e);
                    return acc;
                },
                {} as Record<string, (e: any) => void>,
            ) || {};

        const componentProps = {
            ...props,
            ...eventHandlers,
            className: props.class,
        };

        if (defaultSlot) {
            return Component(
                {
                    ...componentProps,
                    children: defaultSlot(),
                } as Props,
                nestedComponents,
            );
        }

        return Component(componentProps as Props, nestedComponents);
    }

    return funcComponent as unknown as FunctionalComponent<VueToJSXProps<Props>, Emits>;
};
