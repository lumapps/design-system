import { defineComponent, useAttrs } from 'vue';

import {
    ButtonGroup as ButtonGroupUI,
    type ButtonGroupProps as UIProps,
} from '@lumx/core/js/components/Button/ButtonGroup';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ButtonGroupProps = VueToJSXProps<UIProps>;

/**
 * ButtonGroup component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ButtonGroup = defineComponent(
    (props: ButtonGroupProps, { slots }) => {
        const attrs = useAttrs();

        return () => (
            <ButtonGroupUI {...props} {...attrs} className={props.class} children={slots.default?.() as JSXElement} />
        );
    },
    {
        name: 'ButtonGroup',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<ButtonGroupProps>()('class'),
    },
);

export default ButtonGroup;
