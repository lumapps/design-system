import { defineComponent, useAttrs } from 'vue';

import { InputHelper as InputHelperUI, type InputHelperProps as UIProps } from '@lumx/core/js/components/InputHelper';
import type { JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type InputHelperProps = VueToJSXProps<UIProps>;

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const InputHelper = defineComponent(
    (props: InputHelperProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => (
            <InputHelperUI
                {...props}
                {...attrs}
                className={props.class}
                theme={props.theme || defaultTheme.value}
                children={slots.default?.() as JSXElement}
            />
        );
    },
    {
        name: 'InputHelper',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<InputHelperProps>()('kind', 'theme', 'class', 'id'),
    },
);

export default InputHelper;
