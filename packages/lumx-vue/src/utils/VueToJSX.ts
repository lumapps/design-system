import { VNode, SetupContext, EmitsOptions, FunctionalComponent } from 'vue';

export const VueToJSX = <Props, Emits extends EmitsOptions | Record<string, any[]> = Record<string, never>>(
    Component: (props: Props) => VNode,
) => {
    function funcComponent(props: Props, context: SetupContext<Emits>) {
        const { slots } = context;

        const defaultSlot = slots.default;

        if (defaultSlot) {
            return Component({
                ...(props as Props),
                children: defaultSlot(),
            });
        }

        return Component(props as Props);
    }

    return funcComponent as FunctionalComponent<Omit<Props, 'children'>, Emits>;
};
