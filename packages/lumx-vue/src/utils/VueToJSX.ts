import { GenericProps, JSXElement } from '@lumx/core/js/types';
import { VNode, SetupContext, EmitsOptions, FunctionalComponent } from 'vue';

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
export const VueToJSX = <
    Props extends GenericPropsWithChildren,
    Emits extends EmitsOptions | Record<string, any[]> = Record<string, never>,
>(
    Component: (props: Props) => VNode,
) => {
    function funcComponent(props: Props, context: SetupContext<Emits>) {
        const { slots } = context;
        const defaultSlot = slots.default;

        const componentProps = {
            ...props,
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
