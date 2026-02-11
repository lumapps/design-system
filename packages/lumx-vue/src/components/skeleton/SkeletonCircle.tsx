import { defineComponent, useAttrs } from 'vue';

import {
    SkeletonCircle as SkeletonCircleUI,
    type SkeletonCircleProps as UIProps,
    SKELETON_CIRCLE_CLASSNAME as CLASSNAME,
    SKELETON_CIRCLE_COMPONENT_NAME as COMPONENT_NAME,
    SKELETON_CIRCLE_DEFAULT_PROPS as DEFAULT_PROPS,
} from '@lumx/core/js/components/Skeleton';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type SkeletonCircleProps = VueToJSXProps<UIProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * SkeletonCircle component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const SkeletonCircle = defineComponent(
    (props: SkeletonCircleProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <SkeletonCircleUI {...props} {...attrs} className={props.class} theme={props.theme || defaultTheme} />
            );
        };
    },
    {
        name: 'LumxSkeletonCircle',
        inheritAttrs: false,
        props: keysOf<SkeletonCircleProps>()('class', 'size', 'color', 'theme'),
    },
);

export default SkeletonCircle;
