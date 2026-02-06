import { defineComponent, ref, computed, useAttrs, VNodeArrayChildren } from 'vue';

import { getTextProps, type TextProps as UIProps } from '@lumx/core/js/components/Text';

import { useOverflowTooltipLabel } from '../../composables/useOverflowTooltipLabel';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { wrapChildrenIconWithSpaces } from '../../utils/wrapChildrenIconWithSpaces';

export type TextProps = VueToJSXProps<UIProps>;

/**
 * Text component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Text = defineComponent(
    (props: TextProps, { slots }) => {
        const attrs = useAttrs();
        const labelRef = ref<HTMLElement>();
        const { tooltipLabel } = useOverflowTooltipLabel(labelRef);

        const textProps = computed(() =>
            getTextProps({
                ...props,
                className: props.class,
            }),
        );

        const componentProps = computed(() => {
            return { ...attrs, ...textProps.value };
        });

        /**
         * We do a custom render for the children since the slot can contain icons
         * which in that case we need to wrap them with spaces.
         */
        const renderSlot = () => {
            const slot = slots.default?.() as VNodeArrayChildren;
            return slot ? wrapChildrenIconWithSpaces(slot) : null;
        };

        return () => {
            const Component = props.as;
            return (
                <Component
                    ref={labelRef}
                    {...componentProps.value}
                    class={componentProps.value.className}
                    style={componentProps.value.style}
                    title={tooltipLabel.value}
                >
                    {renderSlot()}
                </Component>
            );
        };
    },
    {
        name: 'LumxText',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<TextProps>()(
            'as',
            'color',
            'colorVariant',
            'typography',
            'truncate',
            'noWrap',
            'whiteSpace',
            'class',
            'style',
        ),
    },
);

export default Text;
