import { defineComponent, useAttrs } from 'vue';

import {
    getFlexBoxProps,
    type FlexBoxProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/FlexBox';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type FlexBoxProps = VueToJSXProps<UIProps, 'vAlign' | 'hAlign'> & {
    /** Customize the root element. */
    as?: string;
    /** FlexBox vertical alignment */
    verticalAlign?: UIProps['vAlign'];
    /** FlexBox horizontal alignment */
    horizontalAlign?: UIProps['hAlign'];
};

export { CLASSNAME, COMPONENT_NAME };

/**
 * FlexBox component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const FlexBox = defineComponent(
    (props: FlexBoxProps, { slots }) => {
        const attrs = useAttrs();

        return () => {
            // Cast to keyof JSX.IntrinsicElements because Vue TSX doesn't automatically infer
            // that a string variable can be used as a JSX element name with props/children.
            // This tells TypeScript that Component represents a valid HTML element tag name.
            const Component = (props.as || 'div') as keyof JSX.IntrinsicElements;
            const computedProps = getFlexBoxProps({
                ...props,
                ...attrs,
                className: props.class,
                vAlign: props.verticalAlign,
                hAlign: props.horizontalAlign,
            });

            return <Component {...computedProps}>{slots.default?.() as JSXElement}</Component>;
        };
    },
    {
        name: 'FlexBox',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<FlexBoxProps>()(
            'as',
            'fillSpace',
            'gap',
            'horizontalAlign',
            'marginAuto',
            'noShrink',
            'orientation',
            'verticalAlign',
            'wrap',
            'class',
        ),
    },
);

export default FlexBox;
