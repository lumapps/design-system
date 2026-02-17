import { defineComponent, useAttrs } from 'vue';
import {
    ProgressLinear as ProgressLinearUI,
    type ProgressLinearProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/ProgressLinear';
import { useTheme } from '../../composables/useTheme';
import { keysOf, type VueToJSXProps } from '../../utils/VueToJSX';

export type ProgressLinearProps = VueToJSXProps<UIProps, 'ref'>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

const ProgressLinear = defineComponent(
    (props: ProgressLinearProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <ProgressLinearUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                />
            );
        };
    },
    {
        name: 'LumxProgressLinear',
        inheritAttrs: false,
        props: keysOf<ProgressLinearProps>()('class', 'theme'),
    },
);

export default ProgressLinear;
