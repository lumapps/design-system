import { computed, defineComponent, useAttrs } from 'vue';

import {
    SkeletonRectangle as SkeletonRectangleUI,
    type SkeletonRectangleProps as UIProps,
    SkeletonRectangleVariant,
    SKELETON_RECTANGLE_CLASSNAME as CLASSNAME,
    SKELETON_RECTANGLE_COMPONENT_NAME as COMPONENT_NAME,
    SKELETON_RECTANGLE_DEFAULT_PROPS as DEFAULT_PROPS,
} from '@lumx/core/js/components/Skeleton';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type SkeletonRectangleProps = VueToJSXProps<UIProps>;

export { SkeletonRectangleVariant, CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * SkeletonRectangle component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const SkeletonRectangle = defineComponent(
    (props: SkeletonRectangleProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <SkeletonRectangleUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    theme={props.theme || defaultTheme}
                />
            );
        };
    },
    {
        name: 'LumxSkeletonRectangle',
        inheritAttrs: false,
        props: keysOf<SkeletonRectangleProps>()(
            'class',
            'aspectRatio',
            'height',
            'variant',
            'width',
            'color',
            'theme',
        ),
    },
);

export default SkeletonRectangle;
