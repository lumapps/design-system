import { computed, defineComponent, useAttrs, useTemplateRef, type VNodeArrayChildren } from 'vue';

import { getTextProps, type TextProps } from '@lumx/core/js/components/Text';

import { useOverflowTooltipLabel } from '../../composables/useOverflowTooltipLabel';
import { useSlot } from '../../composables/useSlot';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { wrapChildrenIconWithSpaces } from '../../utils/wrapChildrenIconWithSpaces';

export type TextVueProps = VueToJSXProps<TextProps>;

/**
 * Text component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Text = defineComponent(
    (props: TextVueProps, { slots }) => {
        const attrs = useAttrs();
        const defaultSlot = useSlot();
        const labelRef = useTemplateRef<HTMLElement>('tooltip-label');
        const { tooltipLabel } = useOverflowTooltipLabel(labelRef);

        const textProps = computed(() =>
            getTextProps({
                ...props,
                className: (props.class || attrs.class || attrs.className) as string,
            }),
        );

        const componentProps = computed(() => {
            // Filter out 'children' to avoid Vue warning about read-only DOM property
            const { children: _, ...filteredAttrs } = attrs as any;
            return { ...filteredAttrs, ...textProps.value };
        });

        return () => {
            const Component = props.as || 'div';
            // Handle both slot-based children (Vue template usage) and JSX children (core component usage)
            const slot = defaultSlot<VNodeArrayChildren>() || slots.default?.();
            const children = slot ? wrapChildrenIconWithSpaces(slot) : null;

            return (
                <Component
                    ref="tooltip-label"
                    {...componentProps.value}
                    class={componentProps.value.className}
                    style={componentProps.value.style}
                    title={tooltipLabel.value}
                >
                    {children}
                </Component>
            );
        };
    },
    {
        name: 'LumxText',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<TextVueProps>()(
            'as',
            'color',
            'colorVariant',
            'typography',
            'truncate',
            'noWrap',
            'whiteSpace',
            'style',
            'class',
        ),
    },
);

export default Text;
