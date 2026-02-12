import { defineComponent, useAttrs } from 'vue';

import {
    Divider as DividerUI,
    type DividerProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Divider';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type DividerProps = VueToJSXProps<UIProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Divider component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Divider = defineComponent(
    (props: DividerProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <DividerUI {...attrs} {...props} className={props.class} theme={props.theme || defaultTheme.value} />
            );
        };
    },
    {
        name: 'LumxDivider',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<DividerProps>()('class', 'theme'),
    },
);

export default Divider;
