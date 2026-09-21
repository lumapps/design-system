import { defineComponent, useAttrs } from 'vue';

import {
    InputRequiredLegend as InputRequiredLegendUI,
    type InputRequiredLegendProps as UIProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/InputRequiredLegend';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type InputRequiredLegendProps = VueToJSXProps<UIProps>;

/**
 * InputRequiredLegend component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const InputRequiredLegend = defineComponent(
    (props: InputRequiredLegendProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        return () => (
            <InputRequiredLegendUI
                {...props}
                {...attrs}
                className={className.value}
                theme={props.theme || defaultTheme.value}
            />
        );
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<InputRequiredLegendProps>()('label', 'theme', 'class', 'id'),
    },
);

export default InputRequiredLegend;
