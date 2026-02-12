import { defineComponent, useAttrs } from 'vue';

import { InputLabel as InputLabelUI, type InputLabelProps as UIProps } from '@lumx/core/js/components/InputLabel';
import type { JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type InputLabelProps = VueToJSXProps<UIProps>;

/**
 * InputLabel component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const InputLabel = defineComponent(
    (props: InputLabelProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => (
            <InputLabelUI
                {...props}
                {...attrs}
                className={props.class}
                theme={props.theme || defaultTheme.value}
                children={slots.default?.() as JSXElement}
            />
        );
    },
    {
        name: 'InputLabel',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<InputLabelProps>()('htmlFor', 'isRequired', 'typography', 'theme', 'class'),
    },
);

export default InputLabel;
