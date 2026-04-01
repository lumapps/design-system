import { defineComponent, useAttrs } from 'vue';
import {
    ProgressLinear as ProgressLinearUI,
    type ProgressLinearProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/ProgressLinear';
import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { keysOf, type VueToJSXProps } from '../../utils/VueToJSX';

export type ProgressLinearProps = VueToJSXProps<UIProps, 'ref'>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

const ProgressLinear = defineComponent(
    (props: ProgressLinearProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        return () => {
            return (
                <ProgressLinearUI
                    {...props}
                    {...attrs}
                    className={className.value}
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
