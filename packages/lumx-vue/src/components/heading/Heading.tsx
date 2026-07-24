import { computed, defineComponent, useAttrs } from 'vue';

import { COMPONENT_NAME, getHeadingProps, type HeadingProps as UIProps } from '@lumx/core/js/components/Heading';
import { useClassName } from '@lumx/vue/composables/useClassName';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Text } from '../text';
import { useHeadingLevel } from './useHeadingLevel';

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
        const mergedClassName = useClassName(() => props.class);

        const uiProps = computed(() => {
            const { className, ...headingProps } = getHeadingProps(
                {
                    ...attrs,
                    ...props,
                    className: mergedClassName.value,
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
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<HeadingProps>()(
            'id',
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
