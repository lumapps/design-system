import { defineComponent, useAttrs } from 'vue';
import { InputLabel as InputLabelUI, type InputLabelProps } from '@lumx/core/js/components/InputLabel';

import { useTheme } from '../../composables/useTheme';

/**
 * InputLabel component using defineComponent with JSX.
 */
const InputLabel = defineComponent(
    (props: InputLabelProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        // JSX render function
        return () => (
            <InputLabelUI {...attrs} {...props} className={props.class} theme={props.theme || defaultTheme}>
                {slots.default?.()}
            </InputLabelUI>
        );
    },
    {
        name: 'InputLabel',
        inheritAttrs: false,
    },
);

export default InputLabel;
