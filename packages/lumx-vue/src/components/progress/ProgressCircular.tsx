import { defineComponent, useAttrs } from 'vue';
import {
    ProgressCircular as ProgressCircularUI,
    type ProgressCircularProps as UIProps,
    type ProgressCircularSize,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
} from '@lumx/core/js/components/ProgressCircular';
import { useTheme } from '../../composables/useTheme';
import { keysOf, type VueToJSXProps } from '../../utils/VueToJSX';

export type ProgressCircularProps = VueToJSXProps<UIProps, 'ref' | 'svgProps' | 'circleProps'>;

export type { ProgressCircularSize };
export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

const ProgressCircular = defineComponent(
    (props: ProgressCircularProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <ProgressCircularUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    circleProps={{
                        class: element('path'),
                        'stroke-width': '5',
                    }}
                    svgProps={{
                        class: element('svg'),
                    }}
                />
            );
        };
    },
    {
        name: 'LumxProgressCircular',
        inheritAttrs: false,
        props: keysOf<ProgressCircularProps>()('class', 'size', 'display', 'theme'),
    },
);

export default ProgressCircular;
