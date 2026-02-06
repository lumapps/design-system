import { defineComponent, computed, useAttrs } from 'vue';

import { getHeadingProps, type HeadingProps as UIProps } from '@lumx/core/js/components/Heading';

import { Text } from '../text';
import { useHeadingLevel } from './useHeadingLevel';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type HeadingProps = VueToJSXProps<UIProps>;

/**
 * Heading component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Heading = defineComponent(
    (props: HeadingProps, { slots }) => {
        const attrs = useAttrs();
        const context = useHeadingLevel();

        const uiProps = computed(() => {
            const { className, ...headingProps } = getHeadingProps(
                {
                    ...attrs,
                    ...props,
                    className: props.class,
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
        props: keysOf<HeadingProps>()(
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

export default Heading;
