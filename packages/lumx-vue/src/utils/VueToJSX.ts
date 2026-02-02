import { VNode, SetupContext, EmitsOptions, FunctionalComponent } from 'vue';

import { GenericProps, JSXElement } from '@lumx/core/js/types';

/**
 * Props type that includes optional children for JSX compatibility.
 */
type GenericPropsWithChildren = GenericProps & {
    children?: JSXElement;
};

/**
 * Props interface for components wrapped with VueToJSX.
 * It omits JSX-specific props like `children` and `className` and adds Vue's `class`.
 */
export type VueToJSXProps<Props extends GenericPropsWithChildren> = Omit<Props, 'children' | 'className'> & {
    class?: string;
};

type VueEmits = EmitsOptions | Record<string, any[]>;

/**
 * Higher-order component that wraps a LumX Core component (which uses JSX patterns)
 * to be used as a Vue functional component.
 *
 * It specifically handles:
 * - Mapping Vue's `class` prop to LumX Core's `className` prop.
 * - Mapping Vue's default slot to LumX Core's `children` prop.
 *
 * @param Component The LumX Core component to wrap.
 * @returns A Vue functional component.
 */
export const VueToJSX = <Props extends GenericPropsWithChildren, Emits extends VueEmits = Record<string, never>>(
    Component: (props: Props) => VNode,
    emit?: SetupContext<Emits>['emit'],
    events?: string[],
) => {
    function funcComponent(props: Props, context: SetupContext<Emits>) {
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
            return Component({
                ...componentProps,
                children: defaultSlot(),
            } as Props);
        }

        return Component(componentProps as Props);
    }

    return funcComponent as unknown as FunctionalComponent<VueToJSXProps<Props>, Emits>;
};
