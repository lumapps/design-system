import { computed, defineComponent, useAttrs } from 'vue';

import {
    SkeletonTypography as SkeletonTypographyUI,
    type SkeletonTypographyProps as UIProps,
    SKELETON_TYPOGRAPHY_CLASSNAME as CLASSNAME,
    SKELETON_TYPOGRAPHY_COMPONENT_NAME as COMPONENT_NAME,
    SKELETON_TYPOGRAPHY_DEFAULT_PROPS as DEFAULT_PROPS,
} from '@lumx/core/js/components/Skeleton';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type SkeletonTypographyProps = VueToJSXProps<UIProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * SkeletonTypography component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const SkeletonTypography = defineComponent(
    (props: SkeletonTypographyProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            return (
                <SkeletonTypographyUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    theme={props.theme || defaultTheme}
                />
            );
        };
    },
    {
        name: 'LumxSkeletonTypography',
        inheritAttrs: false,
        props: keysOf<SkeletonTypographyProps>()('class', 'typography', 'width', 'color', 'theme'),
    },
);

export default SkeletonTypography;
