import { defineComponent, useAttrs } from 'vue';

import { RadioGroup as RadioGroupUI, CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/RadioGroup';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf } from '../../utils/VueToJSX';

export interface RadioGroupProps {
    /** CSS class name */
    class?: string;
}

export { CLASSNAME, COMPONENT_NAME };

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const RadioGroup = defineComponent(
    (props: RadioGroupProps, { slots }) => {
        const attrs = useAttrs();

        return () => (
            <RadioGroupUI {...props} {...attrs} className={props.class} children={slots.default?.() as JSXElement} />
        );
    },
    {
        name: 'RadioGroup',
        inheritAttrs: false,
        props: keysOf<RadioGroupProps>()('class'),
    },
);

export default RadioGroup;
