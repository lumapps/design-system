import { defineComponent, useAttrs } from 'vue';

import { JSXElement } from '@lumx/core/js/types';
import { ButtonGroup as ButtonGroupUI, ButtonGroupProps as UIProps } from '@lumx/core/js/components/Button/ButtonGroup';

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

        return () => {
            const children = slots.default?.();

            return <ButtonGroupUI {...attrs} {...props} className={props.class} children={children as JSXElement} />;
        };
    },
    {
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<ButtonGroupProps>()('class'),
    },
);

export default ButtonGroup;
