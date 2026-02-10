import { computed, defineComponent, useAttrs } from 'vue';

import { getHeadingProps, type HeadingProps } from '@lumx/core/js/components/Heading';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Text } from '../text';
import { useHeadingLevel } from './useHeadingLevel';

export type HeadingVueProps = VueToJSXProps<HeadingProps>;

/**
 * Heading component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Heading = defineComponent(
    (props: HeadingVueProps, { slots }) => {
        const attrs = useAttrs();
        const context = useHeadingLevel();

        const uiProps = computed(() => {
            const { className, ...headingProps } = getHeadingProps(
                {
                    ...attrs,
                    ...props,
                    className: (props.class || attrs.class || attrs.className) as string,
                },
                context.headingElement,
            );

            return {
                ...headingProps,
                class: className,
            };
        });

        return () => <Text {...uiProps.value}>{slots.default?.()}</Text>;
    },
    {
        name: 'Heading',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<HeadingVueProps>()(
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

export default Heading;
