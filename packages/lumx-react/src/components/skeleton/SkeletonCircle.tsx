import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    SkeletonCircle as UI,
    SkeletonCircleProps as UIProps,
    SKELETON_CIRCLE_CLASSNAME as CLASSNAME,
    SKELETON_CIRCLE_COMPONENT_NAME as COMPONENT_NAME,
} from '@lumx/core/js/components/Skeleton';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface SkeletonCircleProps extends GenericProps, ReactToJSX<UIProps> {}

const DEFAULT_PROPS: Partial<SkeletonCircleProps> = {};

/**
 * SkeletonCircle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonCircle = forwardRef<SkeletonCircleProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, size, color, theme = defaultTheme, ...forwardedProps } = props;

    return UI({
        ref,
        className,
        size,
        color,
        theme,
        ...forwardedProps,
    });
});
SkeletonCircle.displayName = COMPONENT_NAME;
SkeletonCircle.defaultProps = DEFAULT_PROPS;
SkeletonCircle.className = CLASSNAME;
